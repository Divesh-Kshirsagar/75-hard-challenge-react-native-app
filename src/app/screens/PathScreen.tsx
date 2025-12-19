import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { Lock, Star, Check } from 'lucide-react-native';

export const PathScreen = () => {
    const { daysPath } = useChallengeStore();

    // Optimization: daysPath is kept in sync by the store actions. 
    // Redundant fetching here causes stutter during navigation.
    // If we really need to ensure freshness, use useFocusEffect or InteractionManager, 
    // but the store logic seems sufficient.

    const renderNode = ({ item, index }: { item: any, index: number }) => {
        // Calculate snake positioning
        // Zig-Zag: Left, Center, Right, Center...
        const alignment = ['flex-start', 'center', 'flex-end', 'center'];
        const alignPos = alignment[index % 4] as 'flex-start' | 'center' | 'flex-end'; // Type assertion

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
                <View style={[styles.node, { backgroundColor: bgColor }]}>
                    {icon}
                    <Text style={styles.nodeText}>{item.id}</Text>
                </View>
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
                maxToRenderPerBatch={10}
                windowSize={5}
                removeClippedSubviews={true}
            />
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
    nodeText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 4 }
});
