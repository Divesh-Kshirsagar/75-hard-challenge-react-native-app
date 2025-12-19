import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const scheduleNotifications = async () => {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
  }

  // Cancel existing to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 1. Morning: Picture Reminder (8:00 AM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "75 Hard: Morning Brief",
      body: "Don't forget to take your progress picture!",
    },
    trigger: {
      type: 'calendar',
      hour: 8,
      minute: 0,
      repeats: true,
    } as any,
  });

  // 2. Evening: Water Reminder (6:00 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "75 Hard: Evening Check",
      body: "Finish your water! You should be close to 1 gallon.",
    },
    trigger: {
      type: 'calendar',
      hour: 18,
      minute: 0,
      repeats: true,
    } as any,
  });

  // 3. Critical: Deadline Approaching (8:00 PM)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⚠️ CRITICAL ALERT",
      body: "The day is ending. If you have tasks left, DO THEM NOW.",
      color: '#ff4444',
    },
    trigger: {
      type: 'calendar',
      hour: 20,
      minute: 0,
      repeats: true,
    } as any,
  });
};

export const testNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Test Notification",
            body: "This is a test immediate notification",
        },
        trigger: null, // immediate
    });
};
