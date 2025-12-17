import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';

export const OnboardingScreen = () => {
    const startChallenge = useChallengeStore(state => state.startChallenge);
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        setLoading(true);
        // Start from TODAY
        await startChallenge(new Date().toISOString());
        // Store will update currentDayId, triggering App to switch views
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>75 HARD</Text>
            <Text style={styles.subtitle}>The Mental Toughness Challenge</Text>
            
            <View style={styles.rules}>
                <Text style={styles.rule}>• 2 Workouts (45m each)</Text>
                <Text style={styles.rule}>• 1 Gallon of Water</Text>
                <Text style={styles.rule}>• 10 Pages Reading</Text>
                <Text style={styles.rule}>• Follow a Diet</Text>
                <Text style={styles.rule}>• No Alcohol / Cheat Meals</Text>
                <Text style={styles.rule}>• Take a Progress Pic</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleStart} disabled={loading}>
                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>ACCEPT CHALLENGE</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: 2, marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#888', marginBottom: 40 },
    rules: { marginBottom: 50 },
    rule: { color: '#ccc', fontSize: 16, marginBottom: 10 },
    button: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
    buttonText: { fontSize: 16, fontWeight: 'bold' }
});;
