import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export const PomodoroScreen = () => {
    const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Timer finished
                        clearInterval(intervalRef.current!);
                        setIsActive(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleReset = () => {
        setIsActive(false);
        setTimeLeft(mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME);
    };

    const toggleMode = () => {
        setIsActive(false);
        const newMode = mode === 'FOCUS' ? 'BREAK' : 'FOCUS';
        setMode(newMode);
        setTimeLeft(newMode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>FOCUS TIMER</Text>
            </View>

            <View style={styles.timerCircle}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
                <Text style={styles.modeText}>{mode}</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity onPress={() => setIsActive(!isActive)} style={styles.primaryBtn}>
                    {isActive ? <Pause fill="#000" color="#000" size={32} /> : <Play fill="#000" color="#000" size={32} />}
                </TouchableOpacity>
                
                <TouchableOpacity onPress={handleReset} style={styles.secondaryBtn}>
                    <RotateCcw color="#fff" size={24} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={toggleMode} style={styles.modeBtn}>
                 <Text style={styles.modeBtnText}>SWITCH TO {mode === 'FOCUS' ? 'BREAK' : 'FOCUS'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
    header: { position: 'absolute', top: 60 },
    title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 2 },
    
    timerCircle: { 
        width: 300, height: 300, borderRadius: 150, 
        borderWidth: 4, borderColor: '#333',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: 50
    },
    timerText: { fontSize: 80, fontWeight: 'bold', color: '#fff', fontVariant: ['tabular-nums'] },
    modeText: { color: '#888', fontSize: 18, marginTop: 10, letterSpacing: 2 },

    controls: { flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 40 },
    primaryBtn: { 
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', 
        justifyContent: 'center', alignItems: 'center' 
    },
    secondaryBtn: { 
        width: 60, height: 60, borderRadius: 30, backgroundColor: '#333', 
        justifyContent: 'center', alignItems: 'center' 
    },

    modeBtn: { padding: 15 },
    modeBtnText: { color: '#666', fontWeight: 'bold' }
});;
