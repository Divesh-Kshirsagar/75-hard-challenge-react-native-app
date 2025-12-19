import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Lock, Star, Check } from 'lucide-react-native';

interface PathNodeProps {
    item: any;
    index: number;
    onPress: (dayId: number) => void;
}

export const PathNode = ({ item, index, onPress }: PathNodeProps) => {
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
                onPress={() => onPress(item.id)}
            >
                {icon}
                <Text style={styles.nodeText}>{item.id}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    nodeRow: { marginBottom: 40, width: '100%', flexDirection: 'row' },
    node: { 
        width: 80, height: 80, borderRadius: 40, 
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5
    },
    nodeText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
});
