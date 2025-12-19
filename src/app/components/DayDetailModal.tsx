import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface DayDetailModalProps {
    visible: boolean;
    dayId: number | null;
    onClose: () => void;
    loading: boolean;
    details: { tasks: any[], journal: string | null } | null;
    onImagePress: (uri: string) => void;
}

export const DayDetailModal = ({ visible, dayId, onClose, loading, details, onImagePress }: DayDetailModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Day {dayId}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#fff" />
                    ) : details ? (
                        <ScrollView>
                            <Text style={styles.sectionHeader}>TASKS</Text>
                            {details.tasks.map((task, idx) => {
                                const isImage = task.value && task.value.toString().startsWith('file://');
                                return (
                                    <View key={idx} style={styles.detailRow}>
                                        {task.completed ? <Check color="#00C851" size={16} /> : <View style={{ width: 16 }} />}
                                        {isImage ? (
                                            <TouchableOpacity onPress={() => onImagePress(task.value)}>
                                                <Image 
                                                    source={{ uri: task.value }} 
                                                    style={{ width: 100, height: 100, borderRadius: 8, marginLeft: 10, marginTop: 5 }} 
                                                />
                                            </TouchableOpacity>
                                        ) : (
                                            <Text style={[styles.detailText, task.completed && { color: '#888', textDecorationLine: 'line-through' }]}>
                                                {task.value}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}

                            {details.journal && (
                                <>
                                    <Text style={styles.sectionHeader}>JOURNAL</Text>
                                    <Text style={styles.journalText}>{details.journal}</Text>
                                </>
                            )}
                        </ScrollView>
                    ) : (
                        <Text style={{ color: '#fff' }}>No Data</Text>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1E1E1E', borderRadius: 20, padding: 20, maxHeight: '70%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    sectionHeader: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 15, marginBottom: 10 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailText: { color: '#fff', fontSize: 16, marginLeft: 10 },
    journalText: { color: '#ddd', fontStyle: 'italic', lineHeight: 22 },
});
