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

export const scheduleDailyReminder = async () => {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.status !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;
  }

  // Cancel existing to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule for 9 AM every day
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "75 Hard Challenge",
      body: "Don't forget your tasks for today! Stay hard.",
    },
    trigger: {
      type: 'calendar',
      hour: 9,
      minute: 0,
      repeats: true,
    } as any, // Cast to any to avoid strict TS issues with triggers
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
