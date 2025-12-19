import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { RuleList } from '../components/RuleList';

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
            
            <RuleList />

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
    button: { backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 },
    buttonText: { fontSize: 16, fontWeight: 'bold' }
});;
