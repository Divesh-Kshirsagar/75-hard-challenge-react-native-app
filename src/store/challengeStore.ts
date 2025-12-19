import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, initDB } from '../db/client';
import { days, tasks } from '../db/schema';
import { eq } from 'drizzle-orm';

interface ChallengeState {
  isInitialized: boolean;
  currentDayId: number | null;
  todayTasks: any[];
  daysPath: any[]; 
  galleryImages: any[]; // { id, uri, dayId }
  hasSeenWelcome: boolean;
  userProfile: { name: string; color: string; avatarUri: string };
  setUserProfile: (name: string, color: string) => Promise<void>;
  setHasSeenWelcome: () => Promise<void>;
  checkWelcomeStatus: () => Promise<void>;
  
  initApp: () => Promise<void>;
  startChallenge: (startDate: string) => Promise<void>;
  restartChallenge: () => Promise<void>;
  toggleTask: (taskId: number, currentStatus: boolean) => Promise<void>;
  completeTaskWithValue: (taskId: number, value: string) => Promise<void>;
  refreshToday: () => Promise<void>;
  refreshPath: () => Promise<void>;
  refreshGallery: () => Promise<void>;
  getJournal: () => Promise<string | null>;
  saveJournal: (note: string) => Promise<void>;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  isInitialized: false,
  currentDayId: null,
  todayTasks: [],
  daysPath: [],
  galleryImages: [],

  hasSeenWelcome: false,
  userProfile: { name: 'User', color: 'ff0000', avatarUri: 'https://ui-avatars.com/api/?name=User&background=ff0000' },

  setUserProfile: async (name, color) => {
      const uri = `https://ui-avatars.com/api/?name=${name}&background=${color}`;
      const profile = { name, color, avatarUri: uri };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      set({ userProfile: profile });
  },

  setHasSeenWelcome: async () => {
    await AsyncStorage.setItem('hasSeenWelcome', 'true');
    set({ hasSeenWelcome: true });
  },

  checkWelcomeStatus: async () => {
    const value = await AsyncStorage.getItem('hasSeenWelcome');
    if (value === 'true') {
        set({ hasSeenWelcome: true });
    }
    const profile = await AsyncStorage.getItem('userProfile');
    if (profile) {
        set({ userProfile: JSON.parse(profile) });
    }
  },

  initApp: async () => {
    await get().checkWelcomeStatus();
    await initDB();
    const activeDay = await db.query.days.findFirst({
        where: eq(days.status, 'active')
    });
    
    if (activeDay) {
        // Strict Mode Check
        const todayStr = new Date().toISOString().split('T')[0];
        const activeDateStr = activeDay.date; // stored as YYYY-MM-DD
        
        if (activeDateStr < todayStr) {
             // FAIL LOGIC
             await db.update(days).set({ status: 'failed' }).where(eq(days.id, activeDay.id));
             set({ currentDayId: activeDay.id }); 
        } else {
             set({ currentDayId: activeDay.id });
        }
    }
    
    await get().refreshToday();
    await get().refreshPath();
    set({ isInitialized: true });
  },

  restartChallenge: async () => {
      const today = new Date().toISOString().split('T')[0];
      await get().startChallenge(today);
  },

  startChallenge: async (startDate: string) => {
    const start = new Date(startDate);
    
    // Use Drizzle Transaction
    await db.transaction(async (tx) => {
        // 1. Clear old data (optional, for reset)
        await tx.delete(days);
        await tx.delete(tasks);

        // 2. Loop 75 Days
        for (let i = 1; i <= 75; i++) {
            const d = new Date(start);
            d.setDate(d.getDate() + (i - 1));
            const dateStr = d.toISOString().split('T')[0];

            // Insert Day
            const newDay = await tx.insert(days).values({
                id: i, // Force ID to match day number (1-75)
                date: dateStr,
                status: i === 1 ? 'active' : 'locked',
            }).returning({ insertedId: days.id });
            
            const dayId = newDay[0].insertedId;

            // Insert Daily Constraint Tasks
            const dailyTasks = [
                { dayId, type: 'workout_outdoor', value: '45 min Outdoor Workout' },
                { dayId, type: 'workout_indoor', value: '45 min Indoor Workout' },
                { dayId, type: 'water', value: '1 Gallon (3.7L)' },
                { dayId, type: 'read', value: '10 Pages (Non-fiction)' },
                { dayId, type: 'diet', value: 'Follow Diet Plan' },
                { dayId, type: 'no_alcohol', value: 'Zero Alcohol' },
                { dayId, type: 'pic', value: 'Progress Picture' },
            ];

            // @ts-ignore
            await tx.insert(tasks).values(dailyTasks);
        }
    });

    set({ currentDayId: 1 });
    await get().refreshToday();
    await get().refreshPath();
  },

  refreshToday: async () => {
     const { currentDayId } = get();
     if (!currentDayId) return;
     
     const dayTasks = await db.query.tasks.findMany({
         where: eq(tasks.dayId, currentDayId)
     });
     set({ todayTasks: dayTasks });
  },

  refreshPath: async () => {
      const allDays = await db.query.days.findMany({
          orderBy: (days, { asc }) => [asc(days.id)]
      });
      set({ daysPath: allDays });
  },

  toggleTask: async (taskId, currentStatus) => {
      const { currentDayId } = get();
      if (!currentDayId) return;

      // 1. Update Task
      await db.update(tasks).set({ completed: !currentStatus }).where(eq(tasks.id, taskId));
      
      // 2. Refresh Local State
      await get().refreshToday();

      // 3. Check for Day Completion
      const freshTasks = await db.query.tasks.findMany({
          where: eq(tasks.dayId, currentDayId)
      });

      const allComplete = freshTasks.every(t => t.completed);
      const dayStatus = allComplete ? 'completed' : 'active';

      // 4. Update Day Status
      await db.update(days).set({ status: dayStatus }).where(eq(days.id, currentDayId));
      
      // 5. Refresh Path
      await get().refreshPath();
  },

  getJournal: async () => {
      const { currentDayId } = get();
      if (!currentDayId) return null;
      const day = await db.query.days.findFirst({ where: eq(days.id, currentDayId) });
      return day?.notes || null;
  },

  saveJournal: async (note) => {
      const { currentDayId } = get();
      if (!currentDayId) return;
      await db.update(days).set({ notes: note }).where(eq(days.id, currentDayId));
  },

  refreshGallery: async () => {
      const photoTasks = await db.query.tasks.findMany({
          where: (tasks, { eq, and }) => and(
              eq(tasks.type, 'pic'),
              eq(tasks.completed, true)
          )
      });
      
      const images = photoTasks.map(t => ({
          id: t.id,
          uri: t.value || '',
          dayId: t.dayId
      })).filter(img => img.uri.startsWith('file://'));
      
      set({ galleryImages: images });
  },

  completeTaskWithValue: async (taskId, value) => {
      const { currentDayId } = get();
      if (!currentDayId) return;

      // 1. Update Task with Value and Mark Complete
      await db.update(tasks).set({ 
          completed: true,
          value: value 
      }).where(eq(tasks.id, taskId));
      
      // 2. Refresh Local State
      await get().refreshToday();

      // Check for Day Completion
      const freshTasks = await db.query.tasks.findMany({ where: eq(tasks.dayId, currentDayId) });
      const allComplete = freshTasks.every(t => t.completed);
      const dayStatus = allComplete ? 'completed' : 'active';
      await db.update(days).set({ status: dayStatus }).where(eq(days.id, currentDayId));
      await get().refreshPath();
      await get().refreshGallery();
  }
}));
