import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { Lock, Star, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = 80;

export const PathScreen = () => {
    const { daysPath, refreshPath } = useChallengeStore();

    useEffect(() => {
        refreshPath();
    }, []);

    // Create a Snake Layout
    // 0 1 2
    // 5 4 3
    // 6 7 8
    
    const renderNode = (day, index) => {
        // Calculate snake positioning
        const row = Math.floor(index / 3);
        const isReverseRow = row % 2 === 1;
        const col = isReverseRow ? 2 - (index % 3) : (index % 3);
        
        // Simple Left/Center/Right alignment based on col
        let alignSelf = 'center';
        if (col === 0) alignSelf = 'flex-start';
        if (col === 2) alignSelf = 'flex-end';
        
        // Add some padding to simulate the curve
        const marginLeft = col * (width / 4); 
        
        // Simplified Logic:
        // Just use a centered approach but offset them?
        // Let's stick to a simpler zig-zag: Left, Center, Right, Center, Left...
        
        const alignment = ['flex-start', 'center', 'flex-end', 'center'];
        const alignPos = alignment[index % 4];

        // Styles
        let bgColor = '#333';
        let icon = <Lock color="#666" size={20} />;
        
        if (day.status === 'completed') {
            bgColor = '#00C851'; // Green
            icon = <Check color="#fff" size={24} />;
        } else if (day.status === 'active') {
             bgColor = '#FF8800'; // Orange
             icon = <Star color="#fff" fill="#fff" size={24} />;
        } else if (day.status === 'failed') {
            bgColor = '#ff4444';
        }

        return (
            <View key={day.id} style={[styles.nodeRow, { justifyContent: alignPos }]}>
                <View style={[styles.node, { backgroundColor: bgColor }]}>
                    {icon}
                    <Text style={styles.nodeText}>{day.id}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
             <View style={styles.header}>
                <Text style={styles.headerTitle}>YOUR JOURNEY</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.pathContainer}>
                     {daysPath.map((day, index) => renderNode(day, index))}
                </View>
            </ScrollView>
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
