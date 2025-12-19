import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle, Trophy, Flame } from 'lucide-react-native';
import { useChallengeStore } from '../../store/challengeStore';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: '75 HARD',
        subtitle: 'The Mental Toughness Challenge',
        description: 'This is not a fitness program. It is a transformative mental toughness program.',
        icon: <Flame color="#fff" size={80} />,
        bg: '#000'
    },
    {
        id: '2',
        title: 'THE RULES',
        subtitle: 'Zero Compromises',
        description: 'Two workouts. One gallon of water. Read 10 pages. Follow a diet. No alcohol. Take a progress pic. Every single day.',
        icon: <CheckCircle color="#fff" size={80} />,
        bg: '#111'
    },
    {
        id: '3',
        title: 'NO EXCUSES',
        subtitle: 'Restart if you fail',
        description: 'If you miss a single task, you start over from Day 1. Are you ready to change your life?',
        icon: <Trophy color="#fff" size={80} />,
        bg: '#000'
    }
];

export const WelcomeScreen = () => {
    const navigation = useNavigation<any>();
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
        <View style={[styles.slide, { backgroundColor: item.bg }]}>
            <View style={styles.iconContainer}>
                {item.icon}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.description}>{item.description}</Text>
            
            {index === SLIDES.length - 1 && (
                <TouchableOpacity style={styles.button} onPress={handleNext}>
                    <Text style={styles.buttonText}>I'M READY</Text>
                </TouchableOpacity>
            )}
        </View>
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
    slide: { width, height, alignItems: 'center', justifyContent: 'center', padding: 40 },
    iconContainer: { marginBottom: 40 },
    title: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 2, textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#ff4444', marginBottom: 20, letterSpacing: 1, fontWeight: 'bold' },
    description: { fontSize: 16, color: '#888', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
    button: { marginTop: 60, backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
    buttonText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
    pagination: { position: 'absolute', bottom: 50, flexDirection: 'row', width: '100%', justifyContent: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginHorizontal: 5 },
    activeDot: { backgroundColor: '#fff', width: 20 }
});
