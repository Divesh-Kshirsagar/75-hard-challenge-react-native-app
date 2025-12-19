import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProfileStatsProps {
    completedDays: number;
    failedDays: number;
    totalPhotos: number;
}

export const ProfileStats = ({ completedDays, failedDays, totalPhotos }: ProfileStatsProps) => {
    return (
        <View style={styles.statsRow}>
            <View style={styles.statBox}>
                <Text style={styles.statNum}>{completedDays}</Text>
                <Text style={styles.statLabel}>Completed</Text>
            </View>
             <View style={styles.statBox}>
                <Text style={styles.statNum}>{failedDays}</Text>
                <Text style={styles.statLabel}>Missed</Text>
            </View>
             <View style={styles.statBox}>
                <Text style={styles.statNum}>{totalPhotos}</Text>
                <Text style={styles.statLabel}>Photos</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 40, paddingHorizontal: 20 },
    statBox: { alignItems: 'center', backgroundColor: '#111', padding: 15, borderRadius: 12, minWidth: 100 },
    statNum: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    statLabel: { color: '#666', fontSize: 12, marginTop: 5, textTransform: 'uppercase' },
});
