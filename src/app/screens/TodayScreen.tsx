import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { CustomTodoSection } from '../components/CustomTodoSection';
import { CheckCircle, Circle, Dumbbell, Droplets, Book, Camera, Ban, Utensils } from 'lucide-react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as ImagePicker from 'expo-image-picker';
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

const TaskItem = ({ task, onToggle, onPhoto }: TaskItemProps) => {
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
                {hasPhoto && <Image source={{ uri: task.value as string }} style={styles.thumb} />}
            </View>
            <View>
                {completed ? <CheckCircle color="#fff" size={28} /> : <Circle color="#333" size={28} />}
            </View>
        </TouchableOpacity>
    );
};

export const TodayScreen = () => {
    const { todayTasks, customTodos, toggleTask, completeTaskWithValue, currentDayId, restartChallenge } = useChallengeStore();
    const confettiRef = useRef<ConfettiCannon>(null);
    // Need to know day status. Store updates todayTasks, but maybe we need day status too.
    // Let's derive it or fetch it. 
    // Optimization: Store actually has `daysPath`, we can find it there.
    const { daysPath } = useChallengeStore();
    const currentDay = daysPath.find(d => d.id === currentDayId);
    const isFailed = currentDay?.status === 'failed';

    const isAllComplete = todayTasks.length > 0 && todayTasks.every(t => !!t.completed);

    useEffect(() => {
        if (isAllComplete) {
            confettiRef.current?.start();
        }
    }, [isAllComplete]);

    const handlePhoto = React.useCallback(async (taskId: number) => {
        // ... (existing photo logic)
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
             Alert.alert("Permission needed", "Camera access is required for progress pics!");
             return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'], 
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.3,
        });

        if (!result.canceled && result.assets[0].uri) {
            await completeTaskWithValue(taskId, result.assets[0].uri);
        }
    }, [completeTaskWithValue]);

    const renderTaskItem = React.useCallback(({ item }: { item: Task }) => (
        <TaskItem 
            task={item} 
            onToggle={toggleTask} 
            onPhoto={handlePhoto} 
        />
    ), [toggleTask, handlePhoto]);

    if (isFailed) {
        return (
             <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                <Text style={[styles.dayTitle, { color: '#ff4444' }]}>YOU FAILED</Text>
                <Text style={{ color: '#fff', textAlign: 'center', marginVertical: 20, fontSize: 18 }}>
                    You missed Day {currentDayId}. Strict rules mean you must start over.
                </Text>
                <TouchableOpacity 
                    style={{ backgroundColor: '#ff4444', padding: 20, borderRadius: 30 }}
                    onPress={() => {
                        Alert.alert("Restart Challenge?", "This will wipe current progress and start Day 1.", [
                            { text: "Cancel", style: "cancel" },
                            { text: "Restart", style: "destructive", onPress: restartChallenge }
                        ])
                    }}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>RESTART CHALLENGE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} 
        >
            <View style={styles.header}>
                <Text style={styles.dayTitle}>DAY {currentDayId}</Text>
                <Text style={styles.date}>{new Date().toDateString()}</Text>
            </View>

            <FlatList
                data={todayTasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTaskItem}
                contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
                ListFooterComponent={() => <CustomTodoSection customTodos={customTodos} />}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
            />
            
            {isAllComplete && (
                <ConfettiCannon 
                    count={50} 
                    origin={{x: -10, y: 0}} 
                    autoStart={false} 
                    ref={confettiRef} 
                    fadeOut={true}
                />
            )}
        </KeyboardAvoidingView>
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
