import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { CheckCircle, Circle, Dumbbell, Droplets, Book, Camera, Ban, Utensils } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

// Icon mapping
const getIcon = (type: string, color: string) => {
    switch(type) {
        case 'workout_outdoor': return <Dumbbell color={color} size={24} />;
        case 'workout_indoor': return <Dumbbell color={color} size={24} />;
        case 'water': return <Droplets color={color} size={24} />;
        case 'read': return <Book color={color} size={24} />;
        case 'diet': return <Utensils color={color} size={24} />;
        case 'no_alcohol': return <Ban color={color} size={24} />;
        case 'pic': return <Camera color={color} size={24} />;
        default: return <Circle color={color} size={24} />;
    }
};

interface TaskItemProps {
    task: any; // Ideally import Task type from schema, but using any for MVP velocity if schema type not exported
    onToggle: (id: number, status: boolean) => void;
}

const TaskItem = ({ task, onToggle }: TaskItemProps) => {
    // Force boolean cast to avoid "String cannot be cast to Boolean" crash on Android
    // if Drizzle/SQLite returns 0/1 integer or string.
    const completed = !!task.completed;

    return (
        <TouchableOpacity style={[styles.taskCard, completed && styles.taskCardCompleted]} onPress={() => onToggle(task.id, completed)}>
            <View style={styles.iconContainer}>
                {getIcon(task.type, completed ? '#fff' : '#ff4444')}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, completed && styles.taskTextCompleted]}>{task.value}</Text>
                <Text style={styles.taskSub}>{task.type.replace('_', ' ').toUpperCase()}</Text>
            </View>
            <View>
                {completed ? <CheckCircle color="#fff" size={28} /> : <Circle color="#333" size={28} />}
            </View>
        </TouchableOpacity>
    );
};

export const TodayScreen = () => {
    const { todayTasks, toggleTask, currentDayId } = useChallengeStore();
    const confettiRef = useRef<ConfettiCannon>(null);

    const isAllComplete = todayTasks.length > 0 && todayTasks.every(t => !!t.completed);

    useEffect(() => {
        if (isAllComplete) {
            confettiRef.current?.start();
        }
    }, [isAllComplete]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dayTitle}>DAY {currentDayId}</Text>
                <Text style={styles.date}>{new Date().toDateString()}</Text>
            </View>

            <FlatList
                data={todayTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <TaskItem task={item} onToggle={toggleTask} />}
                contentContainerStyle={{ padding: 20 }}
            />
            
            {isAllComplete && (
                <ConfettiCannon 
                    count={200} 
                    origin={{x: -10, y: 0}} 
                    autoStart={false} 
                    ref={confettiRef} 
                    fadeOut={true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#111' },
    dayTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
    date: { color: '#888', marginTop: 5 },
    taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20, marginBottom: 15, borderRadius: 16 },
    taskCardCompleted: { backgroundColor: '#00C851' }, // Success Green
    iconContainer: { marginRight: 15 },
    taskTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    taskTextCompleted: { textDecorationLine: 'line-through' },
    taskSub: { color: '#666', fontSize: 10, marginTop: 4 }
});
