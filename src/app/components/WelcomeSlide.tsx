import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeSlideProps {
    item: {
        id: string;
        title: string;
        subtitle: string;
        description: string;
        icon: React.ReactNode;
        bg: string;
    };
    isLast: boolean;
    onNext: () => void;
}

export const WelcomeSlide = ({ item, isLast, onNext }: WelcomeSlideProps) => {
    return (
        <View style={[styles.slide, { backgroundColor: item.bg }]}>
            <View style={styles.iconContainer}>
                {item.icon}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.description}>{item.description}</Text>
            
            {isLast && (
                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>I'M READY</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    slide: { width, height, alignItems: 'center', justifyContent: 'center', padding: 40 },
    iconContainer: { marginBottom: 40 },
    title: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 2, textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#ff4444', marginBottom: 20, letterSpacing: 1, fontWeight: 'bold' },
    description: { fontSize: 16, color: '#888', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
    button: { marginTop: 60, backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
    buttonText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
