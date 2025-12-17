import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { CheckCircle, Circle, Dumbbell, Droplets, Book, Camera, Ban, Utensils } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as ImagePicker from 'expo-image-picker';

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
    task: any; 
    onToggle: (id: number, status: boolean) => void;
    onPhoto: (id: number) => void;
}

const TaskItem = ({ task, onToggle, onPhoto }: TaskItemProps) => {
    const completed = !!task.completed;
    const isPhotoTask = task.type === 'pic';
    const hasPhoto = isPhotoTask && completed && task.value.startsWith('file://'); // Simple check

    const handlePress = () => {
        if (isPhotoTask) {
            onPhoto(task.id);
        } else {
            onToggle(task.id, completed);
        }
    };

    return (
        <TouchableOpacity style={[styles.taskCard, completed && styles.taskCardCompleted]} onPress={handlePress}>
            <View style={styles.iconContainer}>
                {getIcon(task.type, completed ? '#fff' : '#ff4444')}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.taskTitle, completed && styles.taskTextCompleted]}>
                     {/* Show "Photo Taken" if it's a URI, otherwise the value */}
                     {isPhotoTask && completed ? "Photo Taken" : task.value}
                </Text>
                <Text style={styles.taskSub}>{task.type.replace('_', ' ').toUpperCase()}</Text>
                {hasPhoto && <Image source={{ uri: task.value }} style={styles.thumb} />}
            </View>
            <View>
                {completed ? <CheckCircle color="#fff" size={28} /> : <Circle color="#333" size={28} />}
            </View>
        </TouchableOpacity>
    );
};

export const TodayScreen = () => {
    const { todayTasks, toggleTask, completeTaskWithValue, currentDayId } = useChallengeStore();
    const confettiRef = useRef<ConfettiCannon>(null);

    const isAllComplete = todayTasks.length > 0 && todayTasks.every(t => !!t.completed);

    useEffect(() => {
        if (isAllComplete) {
            confettiRef.current?.start();
        }
    }, [isAllComplete]);

    const handlePhoto = async (taskId: number) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission needed", "Camera access is required for progress pics!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0].uri) {
            await completeTaskWithValue(taskId, result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.dayTitle}>DAY {currentDayId}</Text>
                <Text style={styles.date}>{new Date().toDateString()}</Text>
            </View>

            <FlatList
                data={todayTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TaskItem 
                        task={item} 
                        onToggle={toggleTask} 
                        onPhoto={handlePhoto} 
                    />
                )}
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
    taskSub: { color: '#666', fontSize: 10, marginTop: 4 },
    thumb: { width: 40, height: 40, borderRadius: 8, marginTop: 5 }
});
