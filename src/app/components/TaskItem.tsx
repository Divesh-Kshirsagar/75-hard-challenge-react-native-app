import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, Platform } from 'react-native';
import { CheckCircle, Circle, Dumbbell, Droplets, Book, Camera, Ban, Utensils } from 'lucide-react-native';
import { InferSelectModel } from 'drizzle-orm';
import { tasks } from '../../db/schema';

type Task = InferSelectModel<typeof tasks>;

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
    task: Task; 
    onToggle: (id: number, status: boolean) => void;
    onPhoto: (id: number) => void;
}

export const TaskItem = ({ task, onToggle, onPhoto }: TaskItemProps) => {
    // SQLite stores booleans as 0/1, Drizzle might map it if mode is boolean
    const completed = !!task.completed;
    const isPhotoTask = task.type === 'pic';
    // @ts-ignore
    const hasPhoto = isPhotoTask && completed && task.value && task.value.startsWith('file://');

    const handlePress = () => {
        if (isPhotoTask) {
            onPhoto(task.id);
        } else {
            onToggle(task.id, completed);
        }
    };

    return (
        <Pressable 
            style={({ pressed }) => [
                styles.taskCard, 
                completed && styles.taskCardCompleted,
                pressed && Platform.OS === 'ios' && { opacity: 0.7 }
            ]} 
            onPress={handlePress}
            android_ripple={{ color: 'rgba(255,255,255,0.1)' }}
        >
            <View style={styles.iconContainer}>
                {getIcon(task.type, completed ? '#fff' : '#ff4444')}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, completed && styles.taskTextCompleted]}>
                     {/* Show "Photo Taken" if it's a URI, otherwise the value */}
                     {isPhotoTask && completed ? "Photo Taken" : task.value}
                </Text>
                <Text style={styles.taskSub}>{task.type.replace('_', ' ').toUpperCase()}</Text>
                {hasPhoto && <Image source={{ uri: task.value as string }} style={styles.thumb} />}
            </View>
            <View>
                {completed ? <CheckCircle color="#fff" size={28} /> : <Circle color="#333" size={28} />}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E1E1E', padding: 20, marginBottom: 15, borderRadius: 16 },
    taskCardCompleted: { backgroundColor: '#00C851' }, // Success Green
    iconContainer: { marginRight: 15 },
    taskTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    taskTextCompleted: { textDecorationLine: 'line-through' },
    taskSub: { color: '#666', fontSize: 10, marginTop: 4 },
    thumb: { width: 60, height: 60, borderRadius: 8, marginTop: 5 }
});
