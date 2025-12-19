import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

interface ProgressGalleryProps {
    images: { id: number; uri: string; dayId: number }[];
}

export const ProgressGallery = ({ images }: ProgressGalleryProps) => {
    return (
        <View>
            <Text style={styles.sectionTitle}>PROGRESS GALLERY ({images.length}/75)</Text>
            
            <View style={styles.gallery}>
                {images.length === 0 ? (
                    <Text style={styles.emptyText}>No photos yet. Capture your progress!</Text>
                ) : (
                    images.map((img) => (
                        <View key={img.id} style={styles.imageContainer}>
                            <Image source={{ uri: img.uri }} style={styles.image} />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Day {img.dayId}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
    gallery: { flexDirection: 'row', flexWrap: 'wrap' },
    imageContainer: { width: ITEM_SIZE, height: ITEM_SIZE, padding: 1 },
    image: { width: '100%', height: '100%' },
    badge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.7)', padding: 4, borderRadius: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    emptyText: { color: '#666', marginLeft: 20, fontStyle: 'italic' },
});
