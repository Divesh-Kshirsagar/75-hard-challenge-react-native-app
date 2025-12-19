import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, initDB } from '../db/client';
import { days, tasks, customTodos as customTodosTable, todoSubtasks as todoSubtasksTable } from '../db/schema';
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
  customTodos: any[]; // { ...todo, subtasks: [] }
  
  // Custom Todo Actions
  addCustomTodo: (title: string, description: string) => Promise<void>;
  deleteCustomTodo: (id: number) => Promise<void>;
  toggleCustomTodo: (id: number) => Promise<void>;
  addSubTask: (todoId: number, content: string) => Promise<void>;
  toggleSubTask: (subtaskId: number) => Promise<void>;
  deleteSubTask: (subtaskId: number) => Promise<void>;

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
  customTodos: [],

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
     
     // 1. Fetch Standard Tasks
     const dayTasks = await db.query.tasks.findMany({
         where: eq(tasks.dayId, currentDayId)
     });
     
     // 2. Fetch Custom Todos with Subtasks
     // Drizzle query relations if configured, or manual join. 
     // For simplicity/speed in this setup without relations defined in schema:
     const cTodos = await db.query.customTodos.findMany({
         where: eq(customTodosTable.dayId, currentDayId)
     });

     const todosWithSubs = await Promise.all(cTodos.map(async (todo) => {
         const subs = await db.query.todoSubtasks.findMany({
             where: eq(todoSubtasksTable.todoId, todo.id)
         });
         return { ...todo, subtasks: subs };
     }));

     set({ todayTasks: dayTasks, customTodos: todosWithSubs });
  },

  addCustomTodo: async (title, description) => {
      const { currentDayId } = get();
      if (!currentDayId) return;
      await db.insert(customTodosTable).values({
          dayId: currentDayId,
          title,
          description,
          completed: false
      });
      await get().refreshToday();
  },

  deleteCustomTodo: async (id) => {
      await db.delete(customTodosTable).where(eq(customTodosTable.id, id));
      await get().refreshToday();
  },

  toggleCustomTodo: async (id) => {
      const { customTodos } = get();
      const todo = customTodos.find(t => t.id === id);
      if (!todo) return;
      
      await db.update(customTodosTable)
        .set({ completed: !todo.completed })
        .where(eq(customTodosTable.id, id));
      
      await get().refreshToday();
  },

  addSubTask: async (todoId, content) => {
      await db.insert(todoSubtasksTable).values({
          todoId,
          content,
          completed: false
      });
      await get().refreshToday();
  },

  toggleSubTask: async (subtaskId) => {
      // Find current status first (optimized approach preferable but fetch is safe)
      const sub = await db.query.todoSubtasks.findFirst({ where: eq(todoSubtasksTable.id, subtaskId) });
      if (sub) {
        await db.update(todoSubtasksTable)
            .set({ completed: !sub.completed })
            .where(eq(todoSubtasksTable.id, subtaskId));
        await get().refreshToday();
      }
  },

  deleteSubTask: async (subtaskId) => {
      await db.delete(todoSubtasksTable).where(eq(todoSubtasksTable.id, subtaskId));
      await get().refreshToday();
  },

  refreshPath: async () => {
      const allDays = await db.query.days.findMany({
          orderBy: (days, { asc }) => [asc(days.id)]
      });
      set({ daysPath: allDays });
  },

  toggleTask: async (taskId, currentStatus) => {
      const { currentDayId, todayTasks } = get();
      if (!currentDayId) return;
      
      const newStatus = !currentStatus;

      // 1. Optimistic Update
      const optimizedTasks = todayTasks.map(t => 
          t.id === taskId ? { ...t, completed: newStatus } : t
      );
      set({ todayTasks: optimizedTasks });

      try {
          // 2. DB Update in Background
          await db.update(tasks).set({ completed: newStatus }).where(eq(tasks.id, taskId));
          
          // 3. Check Day Completion
          // Use in-memory data
          const allComplete = optimizedTasks.every(t => t.completed);
          const dayStatus = allComplete ? 'completed' : 'active';

          if (allComplete || (currentStatus && !newStatus)) { 
               // If we just completed all, OR we un-completed one (might lose 'completed' status), update day
               // Wait, if we uncheck one, we might go from completed -> active.
               await db.update(days).set({ status: dayStatus }).where(eq(days.id, currentDayId));
               get().refreshPath();
          }

      } catch (error) {
          console.error("Failed to toggle task", error);
          get().refreshToday();
      }
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
      const { currentDayId, todayTasks } = get();
      if (!currentDayId) return;

      // 1. Optimistic Update (Immediate UI Feedback)
      const optimizedTasks = todayTasks.map(t => 
          t.id === taskId ? { ...t, completed: true, value: value } : t
      );
      set({ todayTasks: optimizedTasks });

      // 2. Perform DB Updates in Background
      // We don't await these for the UI to respond, but we should handle errors ideally.
      // For now, we trust the DB write succeeds.
      try {
          // Update Task
          await db.update(tasks).set({ 
              completed: true,
              value: value 
          }).where(eq(tasks.id, taskId));

          // Check Day Completion
          // Use the in-memory optimizedTasks for speed
          const allComplete = optimizedTasks.every(t => t.completed);
          const dayStatus = allComplete ? 'completed' : 'active';
          
          if (allComplete) {
               await db.update(days).set({ status: dayStatus }).where(eq(days.id, currentDayId));
               // Only refresh path if day status changed
               get().refreshPath();
          }
          
          // Refresh Gallery in background
          get().refreshGallery();
          
      } catch (error) {
          console.error("Failed to save task", error);
          // Rollback could go here
          get().refreshToday();
      }
  }
}));
