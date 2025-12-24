import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

interface WelcomeSlideProps {
    item: {
        id: string;
        title: string;
        subtitle: string;
        description: string;
        image: any;
    };
    isLast: boolean;
    onNext: () => void;
}

export const WelcomeSlide = ({ item, isLast, onNext }: WelcomeSlideProps) => {
    return (
        <ImageBackground 
            source={item.image} 
            style={styles.slide}
            resizeMode="cover"
        >
            <View style={styles.overlay} />
            <View style={styles.content}>
                <Text style={styles.brandName}>IRONCLAD</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <Text style={styles.description}>{item.description}</Text>
                
                {isLast && (
                    <TouchableOpacity style={styles.button} onPress={onNext}>
                        <Text style={styles.buttonText}>I'M READY</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    slide: { width, height },
    overlay: { 
        ...StyleSheet.absoluteFillObject, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)' 
    },
    content: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: 40 
    },
    brandName: { 
        fontSize: 28, 
        fontWeight: '900', 
        color: '#fff', 
        letterSpacing: 4, 
        textAlign: 'center', 
        marginBottom: 80,
        position: 'absolute',
        top: 60
    },
    title: { fontSize: 42, fontWeight: '900', color: '#fff', letterSpacing: 2, textAlign: 'center', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#ff4444', marginBottom: 20, letterSpacing: 1, fontWeight: 'bold' },
    description: { fontSize: 16, color: '#ddd', textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
    button: { marginTop: 60, backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 50, borderRadius: 30 },
    buttonText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
