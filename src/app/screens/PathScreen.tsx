import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { PathNode } from '../components/PathNode';
import { DayDetailModal } from '../components/DayDetailModal';
import { FullScreenImageModal } from '../components/FullScreenImageModal';

export const PathScreen = () => {
    const { daysPath, getDayDetails } = useChallengeStore();
    const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
    const [dayDetails, setDayDetails] = React.useState<{tasks: any[], journal: string | null} | null>(null);
    const [fullScreenImage, setFullScreenImage] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleNodePress = async (dayId: number) => {
        setSelectedDay(dayId);
        setLoading(true);
        const details = await getDayDetails(dayId);
        setDayDetails(details);
        setLoading(false);
    };

    const renderNode = ({ item, index }: { item: any, index: number }) => (
        <PathNode 
            item={item} 
            index={index} 
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
                initialNumToRender={10}
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
    scroll: { paddingVertical: 40 },
});
