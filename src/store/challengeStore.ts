import { create } from 'zustand';
import { db, initDB } from '../db/client';
import { days, tasks } from '../db/schema';
import { eq } from 'drizzle-orm';

interface ChallengeState {
  isInitialized: boolean;
  currentDayId: number | null;
  todayTasks: any[];
  daysPath: any[]; 
  galleryImages: any[]; // { id, uri, dayId }
  
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

  initApp: async () => {
    await initDB();
    const activeDay = await db.query.days.findFirst({
        where: eq(days.status, 'active')
    });
    
    if (activeDay) {
        // Strict Mode Check
        const todayStr = new Date().toISOString().split('T')[0];
        const activeDateStr = activeDay.date; // stored as YYYY-MM-DD
        
        // If active day is in the past (and not completed), it's a fail.
        // Wait, if I open app TODAY, and active day is TODAY, I'm good.
        // If active day is YESTERDAY, I missed it?
        // Actually, if active day is yesterday and status is still 'active', it means I didn't finish it yesterday.
        // So if activeDate < todayStr, FAIL.
        
        if (activeDateStr < todayStr) {
             // FAIL LOGIC
             // Mark current day as failed
             await db.update(days).set({ status: 'failed' }).where(eq(days.id, activeDay.id));
             
             // In 75 Hard, if you fail, you restart.
             // We'll update state to show failure.
             set({ currentDayId: activeDay.id }); // Show the failed day?
             // Or maybe we need a global 'hasFailed' flag?
             // For now, let's just let the UI reflect 'failed' status on the current day if we want.
             // But the user needs to know they failed.
             
             const failedDay = { ...activeDay, status: 'failed' };
             // We probably want to keep it as currentDayId so the UI shows "FAILED".
        } else {
             set({ currentDayId: activeDay.id });
        }
    } else {
        // If no active day, maybe completed or failed?
        // Find last modified?
        // For now, default logic is fine.
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
