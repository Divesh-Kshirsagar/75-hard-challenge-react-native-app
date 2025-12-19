import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Check, X, Lock } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const GAP = 5;
const PADDING = 20;
// Precise math ensures 7 items fit exactly with 6 gaps of 5px
export const ITEM_SIZE = (width - (PADDING * 2) - (GAP * 6)) / 7;

interface GridNodeProps {
    day: any; // Using any to handle the raw DB data
    isToday: boolean; // We pass this helper prop
    onPress: (id: number) => void;
}

export const GridNode = ({ day, isToday, onPress }: GridNodeProps) => {
    // 1. Map DB status to Visual state
    const isCompleted = day.status === 'completed';
    const isFailed = day.status === 'failed';
    const isLocked = day.status === 'locked'; 
    // "Active" in DB means it is the current day being worked on
    const isActive = day.status === 'active';

    // 2. Determine Styles
    let bgColor = '#1E1E1E'; // Default (Pending/Future)
    let borderColor = 'transparent';
    let borderWidth = 0;

    if (isCompleted) bgColor = '#00C851'; // Green
    if (isFailed) bgColor = '#ff4444';    // Red
    if (isLocked) bgColor = '#111';       // Darker for future

    // Special highlighting for TODAY (whether active or completed)
    if (isToday) {
        borderColor = '#fff';
        borderWidth = 1.5;
        // If it's active (not done yet), make it slightly lighter to stand out
        if (isActive) bgColor = '#333';
    }

return (
        <TouchableOpacity 
            // 1. SHARPER CORNERS: Reduced borderRadius from 8 to 4
            style={[styles.node, { backgroundColor: bgColor, borderColor, borderWidth, borderRadius: 4 }]} 
            onPress={() => onPress(day.id)}
            disabled={isLocked}
        >
            {/* 2. CLEANER TEXT: No overlapping icons for Completed/Failed. 
                The color tells the story. */}
            <Text style={[
                styles.dayText, 
                (isCompleted || isFailed) && { color: '#fff', fontWeight: '900', fontSize: 14 }
            ]}>
                {day.id}
            </Text>
            
            {/* 3. SUBTLETY: Only show Lock icon for future days (faintly) */}
            {isLocked && (
                <View style={styles.iconOverlay}>
                     <Lock color="#333" size={12} />
                </View>
            )}
            {/* Remove the Check/X icons entirely to reduce noise */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    node: {
        width: ITEM_SIZE,
        height: ITEM_SIZE,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        // REMOVED marginRight here. We let the FlatList gap handle it.
        marginBottom: 5, // Keep vertical gap
    },
    dayText: { color: '#666', fontSize: 12, zIndex: 2 },
    iconOverlay: {
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center', alignItems: 'center', zIndex: 1,
    }
});