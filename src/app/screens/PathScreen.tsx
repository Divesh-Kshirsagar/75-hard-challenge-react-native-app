import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { GridNode } from '../components/GridNode'; // Import updated component
import { DayDetailModal } from '../components/DayDetailModal';
import { FullScreenImageModal } from '../components/FullScreenImageModal';

export const PathScreen = () => {
    const { daysPath, getDayDetails, currentDayId } = useChallengeStore();
    const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
    const [dayDetails, setDayDetails] = React.useState<any>(null);
    const [fullScreenImage, setFullScreenImage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleNodePress = async (dayId: number) => {
        setSelectedDay(dayId);
        setLoading(true);
        const details = await getDayDetails(dayId);
        setDayDetails(details);
        setLoading(false);
    };

    const renderNode = ({ item }: { item: any }) => (
        <GridNode 
            day={item} 
            isToday={item.id === currentDayId} // Pass this explicitly for the white border
            onPress={handleNodePress} 
        />
    );

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
                numColumns={7}
                // UX FIX: This handles the horizontal gap perfectly between columns
                // without adding extra margin to the last item
                columnWrapperStyle={{ gap: 5 }} 
            />

            <DayDetailModal 
                visible={!!selectedDay}
                dayId={selectedDay}
                onClose={() => setSelectedDay(null)}
                loading={loading}
                details={dayDetails}
                onImagePress={setFullScreenImage}
            />

            <FullScreenImageModal 
                visible={!!fullScreenImage}
                imageUri={fullScreenImage}
                onClose={() => setFullScreenImage(null)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#111' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#000', alignItems: 'center' },
    headerTitle: { color: '#fff', fontWeight: 'bold', fontSize: 20, letterSpacing: 2 },
    // Ensure padding matches the calculation in GridNode (20)
    scroll: { padding: 20, paddingBottom: 100 },
});