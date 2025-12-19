import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PomodoroTimerProps {
    timeLeft: number;
    mode: 'FOCUS' | 'BREAK';
}

export const PomodoroTimer = ({ timeLeft, mode }: PomodoroTimerProps) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.timerCircle}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.modeText}>{mode}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    timerCircle: { 
        width: 300, height: 300, borderRadius: 150, 
        borderWidth: 4, borderColor: '#333',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 50
    },
    timerText: { fontSize: 80, fontWeight: 'bold', color: '#fff', fontVariant: ['tabular-nums'] },
    modeText: { color: '#888', fontSize: 18, marginTop: 10, letterSpacing: 2 },
});
