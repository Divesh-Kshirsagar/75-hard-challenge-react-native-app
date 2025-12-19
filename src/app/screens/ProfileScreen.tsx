import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { AvatarSelector } from '../components/AvatarSelector';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 3;

export const ProfileScreen = () => {
    const { galleryImages, refreshGallery, daysPath, userProfile, setUserProfile } = useChallengeStore();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        refreshGallery();
    }, []);

    const completedDays = daysPath.filter(d => d.status === 'completed').length;
    const failedDays = daysPath.filter(d => d.status === 'failed').length;

    // Calculate Current Streak (naive: count backwards from today until not completed)
    // For MVP, just Total Completed is a good stat.

    const renderImage = ({ item }: any) => ( // Fix type implicit any
        <View style={styles.imageContainer}>
             <Image source={{ uri: item.uri }} style={styles.image} />
             <View style={styles.badge}>
                 <Text style={styles.badgeText}>Day {item.dayId}</Text>
             </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Image source={{ uri: userProfile.avatarUri }} style={styles.avatar} />
                </TouchableOpacity>
                <Text style={styles.name}>{userProfile.name.toUpperCase()}</Text>
                <Text style={styles.subtext}>75 Hard Journey</Text>
                
                <TouchableOpacity style={styles.editBadge} onPress={() => setIsEditing(true)}>
                    <Text style={styles.editText}>EDIT</Text>
                </TouchableOpacity>
            </View>

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
                    <Text style={styles.statNum}>{galleryImages.length}</Text>
                    <Text style={styles.statLabel}>Photos</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>PROGRESS GALLERY ({galleryImages.length}/75)</Text>
            
            <View style={styles.gallery}>
                {galleryImages.length === 0 ? (
                    <Text style={styles.emptyText}>No photos yet. Capture your progress!</Text>
                ) : (
                    galleryImages.map((img: { id: number; uri: string; dayId: number }) => (
                        <View key={img.id} style={styles.imageContainer}>
                            <Image source={{ uri: img.uri }} style={styles.image} />
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Day {img.dayId}</Text>
                            </View>
                        </View>
                    ))
                )}
            </View>
             <View style={{ height: 100 }} /> 

             <AvatarSelector 
                visible={isEditing}
                onClose={() => setIsEditing(false)}
                onSave={setUserProfile}
                currentName={userProfile.name}
                currentColor={userProfile.color}
             />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15, borderWidth: 2, borderColor: '#fff' },
    name: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
    subtext: { color: '#888', marginTop: 5 },
    
    statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 40, paddingHorizontal: 20 },
    statBox: { alignItems: 'center', backgroundColor: '#111', padding: 15, borderRadius: 12, minWidth: 100 },
    statNum: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    statLabel: { color: '#666', fontSize: 12, marginTop: 5, textTransform: 'uppercase' },

    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 20, marginBottom: 20 },
    gallery: { flexDirection: 'row', flexWrap: 'wrap' },
    imageContainer: { width: ITEM_SIZE, height: ITEM_SIZE, padding: 1 },
    image: { width: '100%', height: '100%' },
    badge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.7)', padding: 4, borderRadius: 4 },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    emptyText: { color: '#666', marginLeft: 20, fontStyle: 'italic' },
    editBadge: { marginTop: 15, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#333', borderRadius: 20 },
    editText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});;
