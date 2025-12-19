import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { Lock, Star, Check } from 'lucide-react-native';

import { Modal, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { X } from 'lucide-react-native';

export const PathScreen = () => {
    const { daysPath, getDayDetails } = useChallengeStore();
    const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
    const [dayDetails, setDayDetails] = React.useState<{tasks: any[], journal: string | null} | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleNodePress = async (dayId: number) => {
        setSelectedDay(dayId);
        setLoading(true);
        const details = await getDayDetails(dayId);
        setDayDetails(details);
        setLoading(false);
    };

    const renderNode = ({ item, index }: { item: any, index: number }) => {
        // Calculate snake positioning
        const alignment = ['flex-start', 'center', 'flex-end', 'center'];
        const alignPos = alignment[index % 4] as 'flex-start' | 'center' | 'flex-end'; 

        // Styles
        let bgColor = '#333';
        let icon = <Lock color="#666" size={20} />;
        
        if (item.status === 'completed') {
            bgColor = '#00C851'; // Green
            icon = <Check color="#fff" size={24} />;
        } else if (item.status === 'active') {
             bgColor = '#FF8800'; // Orange
             icon = <Star color="#fff" fill="#fff" size={24} />;
        } else if (item.status === 'failed') {
            bgColor = '#ff4444';
        }

        return (
            <View style={[styles.nodeRow, { justifyContent: alignPos }]}>
                <TouchableOpacity 
                    style={[styles.node, { backgroundColor: bgColor }]}
                    onPress={() => handleNodePress(item.id)}
                >
                    {icon}
                    <Text style={styles.nodeText}>{item.id}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>YOUR JOURNEY</Text>
            </View>
            <FlatList 
                data={daysPath}
                renderItem={renderNode}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.scroll}
                initialNumToRender={10}
            />

            {/* Day Detail Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={!!selectedDay}
                onRequestClose={() => setSelectedDay(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Day {selectedDay}</Text>
                            <TouchableOpacity onPress={() => setSelectedDay(null)}>
                                <X color="#fff" size={24} />
                            </TouchableOpacity>
                        </View>

                        {loading ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : dayDetails ? (
                            <ScrollView>
                                <Text style={styles.sectionHeader}>TASKS</Text>
                                {dayDetails.tasks.map((task, idx) => {
                                    const isImage = task.value && task.value.toString().startsWith('file://');
                                    return (
                                        <View key={idx} style={styles.detailRow}>
                                            {task.completed ? <Check color="#00C851" size={16} /> : <View style={{ width: 16 }} />}
                                            {isImage ? (
                                                <Image 
                                                    source={{ uri: task.value }} 
                                                    style={{ width: 100, height: 100, borderRadius: 8, marginLeft: 10, marginTop: 5 }} 
                                                />
                                            ) : (
                                                <Text style={[styles.detailText, task.completed && { color: '#888', textDecorationLine: 'line-through' }]}>
                                                    {task.value}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}

                                {dayDetails.journal && (
                                    <>
                                        <Text style={styles.sectionHeader}>JOURNAL</Text>
                                        <Text style={styles.journalText}>{dayDetails.journal}</Text>
                                    </>
                                )}
                            </ScrollView>
                        ) : (
                            <Text style={{ color: '#fff' }}>No Data</Text>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#000', alignItems: 'center' },
    headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 2 },
    scroll: { paddingVertical: 40 },
    pathContainer: { width: '80%', alignSelf: 'center' },
    nodeRow: { marginBottom: 40, width: '100%', flexDirection: 'row' },
    node: { 
        width: 80, height: 80, borderRadius: 40, 
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
    },
    nodeText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
    
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1E1E1E', borderRadius: 20, padding: 20, maxHeight: '70%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    sectionHeader: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 15, marginBottom: 10 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    detailText: { color: '#fff', fontSize: 16, marginLeft: 10 },
    journalText: { color: '#ddd', fontStyle: 'italic', lineHeight: 22 }
});
