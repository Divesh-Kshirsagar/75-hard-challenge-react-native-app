import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Modal, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChallengeStore } from '../../store/challengeStore';
import { scheduleNotifications } from '../utils/notifications';
import { CustomTodoSection } from '../components/CustomTodoSection';
import { TaskItem } from '../components/TaskItem';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as ImagePicker from 'expo-image-picker';
import { InferSelectModel } from 'drizzle-orm';
import { tasks } from '../../db/schema';

type Task = InferSelectModel<typeof tasks>;

export const TodayScreen = () => {
    const navigation = useNavigation<any>();
    const { todayTasks, customTodos, toggleTask, completeTaskWithValue, currentDayId, restartChallenge, daysPath } = useChallengeStore();
    
    // Day Status Logic
    const currentDay = daysPath.find(d => d.id === currentDayId);
    const isFailed = currentDay?.status === 'failed';
    // const isFailed = true;
    const isAllComplete = todayTasks.length > 0 && todayTasks.every(t => !!t.completed);

    // Initialize Notifications
    React.useEffect(() => {
        scheduleNotifications();
    }, []);

    const [viewingPhoto, setViewingPhoto] = React.useState<string | null>(null);
    const [activePhotoTaskId, setActivePhotoTaskId] = React.useState<number | null>(null);

    const takePhoto = React.useCallback(async (taskId: number) => {
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

    const handlePhoto = React.useCallback(async (taskId: number) => {
        const task = todayTasks.find(t => t.id === taskId);
        // Check if photo exists in task value
        if (task?.value && task.value.startsWith('file://')) {
            setViewingPhoto(task.value);
            setActivePhotoTaskId(taskId);
            return;
        }

        takePhoto(taskId);
    }, [todayTasks, takePhoto]);

    const renderTaskItem = React.useCallback(({ item }: { item: Task }) => (
        <TaskItem 
            task={item} 
            onToggle={toggleTask} 
            onPhoto={handlePhoto} 
        />
    ), [toggleTask, handlePhoto]);

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView 
                style={{ flex: 1 }} 
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
                    <View style={StyleSheet.absoluteFill} pointerEvents="none">
                        <ConfettiCannon 
                            count={50} 
                            origin={{x: -10, y: 0}} 
                            autoStart={true} 
                            fadeOut={true}
                        />
                    </View>
                )}
            </KeyboardAvoidingView>

            {isFailed && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 100, justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
                    <Text style={[styles.dayTitle, { color: '#ff4444', marginBottom: 10 }]}>YOU FAILED</Text>
                    <Text style={{ color: '#ccc', textAlign: 'center', marginBottom: 30, fontSize: 16, lineHeight: 24 }}>
                        You missed Day {currentDayId}. Strict rules mean you must start over.{'\n'}
                        Check your Path to see your streak.
                    </Text>
                    
                    <TouchableOpacity 
                        style={{ backgroundColor: '#ff4444', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, marginBottom: 15, width: '80%', alignItems: 'center' }}
                        onPress={() => {
                            Alert.alert("Restart Challenge?", "This will wipe current progress and start Day 1.", [
                                { text: "Cancel", style: "cancel" },
                                { text: "Restart", style: "destructive", onPress: restartChallenge }
                            ])
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>RESTART CHALLENGE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={{ paddingVertical: 15, paddingHorizontal: 30, borderRadius: 30, borderWidth: 1, borderColor: '#666', width: '80%', alignItems: 'center' }}
                        onPress={() => navigation.navigate('Path')}
                    >
                        <Text style={{ color: '#ccc', fontWeight: 'bold', fontSize: 14 }}>VIEW HISTORY</Text>
                    </TouchableOpacity>
                </View>
            )}

            <Modal visible={!!viewingPhoto} transparent={true} animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center' }}>
                    <TouchableOpacity 
                        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10 }}
                        onPress={() => setViewingPhoto(null)}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Close</Text>
                    </TouchableOpacity>

                    {viewingPhoto && (
                        <Image source={{ uri: viewingPhoto }} style={{ width: '100%', height: '80%', resizeMode: 'contain' }} />
                    )}

                    <TouchableOpacity 
                        style={{ alignSelf: 'center', marginTop: 20, backgroundColor: '#333', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30 }}
                        onPress={() => {
                            setViewingPhoto(null);
                            if (activePhotoTaskId) takePhoto(activePhotoTaskId);
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retake Photo</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#111' },
    dayTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
    date: { color: '#888', marginTop: 5 },
});
