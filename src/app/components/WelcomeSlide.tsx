import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
                    <TouchableOpacity style={styles.buttonContainer} onPress={onNext} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#636363', '#000000']}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>ACCEPT CHALLENGE</Text>
                        </LinearGradient>
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
    buttonContainer: { 
        marginTop: 36,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#ff3d00',
        shadowColor: '#ff0000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 8,
    },
    button: { 
        paddingVertical: 20, 
        paddingHorizontal: 120, 
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: { 
        fontSize: 14, 
        fontWeight: '600', 
        letterSpacing: 0.1, 
        color: '#fff',
    },
});
