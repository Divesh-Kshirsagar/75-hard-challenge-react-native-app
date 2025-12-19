import { Alert } from 'react-native';

// Mock Ad Service
// In a real app, this would wrap AdMob / Google Mobile Ads

// Cap: Once every 3 days? Or just a simple check for now since we can't persist easily without AsyncStorage.
// "frequency capped to maybe once every 3 days"
// For prototype: Let's just use a simple mock that always succeeds or has a simple counter.
// Since I don't want to add AsyncStorage just for this mock yet unless I have to.
// I'll stick to a simple in-memory check for the session, or just allow it for testing.

let lastInterstitialTime = 0;
const CAP_DURATION = 1000 * 60 * 60 * 24 * 3; // 3 days

export const AdService = {
    showInterstitial: async (): Promise<boolean> => {
        const now = Date.now();
        // Check cap
        if (now - lastInterstitialTime < CAP_DURATION && lastInterstitialTime !== 0) {
            console.log("Ad capped");
            return false;
        }

        // Mock Ad Display
        return new Promise((resolve) => {
            Alert.alert(
                "Advertisement",
                "This is a placeholder for an Interstitial Ad.\n\n[ imagine a full screen ad here ]",
                [
                    { 
                        text: "Close Ad", 
                        onPress: () => {
                            lastInterstitialTime = Date.now();
                            resolve(true);
                        } 
                    }
                ]
            );
        });
    },

    shouldShowBanner: (): boolean => {
        return true; 
    }
};
