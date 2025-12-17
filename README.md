# 75 Hard Challenge App ⚔️

A comprehensive, offline-first mobile application designed to help you complete the **75 Hard** mental toughness program. Built with React Native, Expo, and TypeScript.

## 🚀 Features

### 📅 Daily Tracking
-   **Strict 75-Day Schedule:** Automatically seeded with the 7 core tasks (Workouts, Water, Reading, Diet, No Alcohol, Progress Pic).
-   **Offline Storage:** All data is stored locally using SQLite (via Drizzle ORM).
-   **Strict Rules:** Use of "Strict Mode" checks. If you miss a day, the challenge fails, and you must restart.

### 🐍 The Path
-   **Visual Journey:** A Duolingo-style "Snake" path visualizes your 75-day progress.
-   **Status Indicators:** Locked, Active, Completed, and Failed days are clearly distinct.

### 📸 Progress Gallery
-   **Photo Capture:** Dedicated task triggers the camera.
-   **Gallery View:** View your transformation with a grid of all daily photos and completion stats in the Profile tab.

### ⏱️ Pomodoro Focus Timer
-   **Focus Mode:** Built-in 25:5 minute timer to help you get your reading or work done.

### 📝 Daily Journal
-   **Reflect:** Log your thoughts and discipline levels for every day.

### 🔔 Notifications
-   **Daily Reminders:** Automated local notifications at 09:00 and 20:00 to keep you on track.

## 🛠️ Tech Stack

-   **Framework:** React Native (Expo SDK 54)
-   **Language:** TypeScript
-   **Database:** Local SQLite (expo-sqlite) + Drizzle ORM
-   **State Management:** Zustand
-   **Navigation:** React Navigation (Bottom Tabs)
-   **UI/Animations:** Reanimated, Lucide Icons, Confetti Cannon

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo-url>
    cd seventy-five-hard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Start the server:**
    ```bash
    npx expo start -c
    ```
    *Note: The `-c` flag clears the cache, which is recommended.*

## ⚠️ Notes for Expo Go

-   **Widgets:** Home Screen widgets require a Development Build (EAS Build) and cannot be previewed in the standard Expo Go app. 
-   **Notifications:** Push Notifications are limited in Expo Go; this app uses *Local Notifications* which work great.

## 📜 License

MIT License. Built for Personal Growth.
