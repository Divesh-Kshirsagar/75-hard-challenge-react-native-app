import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { WelcomeSlide } from '../components/WelcomeSlide';

const { width } = Dimensions.get('window');

// TODO: Replace these placeholders with actual images from assets folder
// Example: require('../../assets/welcome-1.jpg')
const SLIDES = [
    {
        id: '1',
        title: '75 HARD',
        subtitle: 'The Mental Toughness Challenge',
        description: 'This is not a fitness program. It is a transformative mental toughness program.',
        image: require('../../../assets/torch.webp')
    },
    {
        id: '2',
        title: 'THE RULES',
        subtitle: 'Zero Compromises',
        description: 'Two workouts. One gallon of water. Read 10 pages. Follow a diet. No alcohol. Take a progress pic. Every single day.',
        image: require('../../../assets/dumbell.webp')
    },
    {
        id: '3',
        title: 'NO EXCUSES',
        subtitle: 'Restart if you fail',
        description: 'If you miss a single task, you start over from Day 1. Are you ready to change your life?',
        image: require('../../../assets/excuses.webp')
    }
];

export const WelcomeScreen = () => {
    const setHasSeenWelcome = useChallengeStore(state => state.setHasSeenWelcome);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
             // Let user swipe manually or implement ref to scroll
        } else {
            await setHasSeenWelcome();
        }
    };

    const renderItem = ({ item, index }: { item: typeof SLIDES[0], index: number }) => (
        <WelcomeSlide 
            item={item} 
            isLast={index === SLIDES.length - 1} 
            onNext={handleNext} 
        />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={SLIDES}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onMomentumScrollEnd={(e) => {
                    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(idx);
                }}
            />
            
            <View style={styles.pagination}>
                {SLIDES.map((_, i) => (
                    <View 
                        key={i} 
                        style={[
                            styles.dot, 
                            i === currentIndex && styles.activeDot
                        ]} 
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    pagination: { position: 'absolute', bottom: 50, flexDirection: 'row', width: '100%', justifyContent: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginHorizontal: 5 },
    activeDot: { backgroundColor: '#fff', width: 20 }
});
