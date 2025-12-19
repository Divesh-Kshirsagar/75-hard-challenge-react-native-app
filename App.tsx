import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useChallengeStore } from './src/store/challengeStore';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from './src/app/screens/OnboardingScreen';
import { WelcomeScreen } from './src/app/screens/WelcomeScreen';
import { MainNavigator } from './src/app/MainNavigator';
import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Stack = createNativeStackNavigator();

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000',
  },
};

export default function App() {
  const { initApp, isInitialized, currentDayId, hasSeenWelcome } = useChallengeStore();

  useEffect(() => {
    initApp();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        return; // Failed to get permission
    }

    // Schedule Reminders if not already scheduled
    // For MVP, we cancel all and re-schedule to be safe
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
        content: { title: "75 Hard", body: "Don't forget your tasks today!" },
        trigger: { 
            type: 'calendar',
            hour: 9, 
            minute: 0, 
            repeats: true 
        } as any, // Cast to any to bypass strict TS check for now if types are complex, but 'calendar' is correct
    });

    await Notifications.scheduleNotificationAsync({
        content: { title: "75 Hard", body: "Finish strong! Log your day." },
        trigger: { 
            type: 'calendar',
            hour: 20, 
            minute: 0, 
            repeats: true 
        } as any,
    });
  };

  if (!isInitialized) {
    return null; // Or Splash Screen
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer theme={MyDarkTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!hasSeenWelcome && (
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          )}
          {!currentDayId && (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          )}
          {currentDayId && (
            <Stack.Screen name="Main" component={MainNavigator} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
