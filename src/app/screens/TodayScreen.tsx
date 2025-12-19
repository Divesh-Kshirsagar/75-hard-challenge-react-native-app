import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { CustomTodoSection } from '../components/CustomTodoSection';
import { TaskItem } from '../components/TaskItem';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as ImagePicker from 'expo-image-picker';
import { InferSelectModel } from 'drizzle-orm';
import { tasks } from '../../db/schema';

type Task = InferSelectModel<typeof tasks>;

export const TodayScreen = () => {
    const { todayTasks, customTodos, toggleTask, completeTaskWithValue, currentDayId, restartChallenge, daysPath } = useChallengeStore();
    
    // Day Status Logic
    const currentDay = daysPath.find(d => d.id === currentDayId);
    const isFailed = currentDay?.status === 'failed';
    const isAllComplete = todayTasks.length > 0 && todayTasks.every(t => !!t.completed);

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
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#111' },
    dayTitle: { fontSize: 32, fontWeight: '900', color: '#fff' },
    date: { color: '#888', marginTop: 5 },
});
