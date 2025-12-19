import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { AvatarSelector } from '../components/AvatarSelector';
import { ProfileStats } from '../components/ProfileStats';
import { ProgressGallery } from '../components/ProgressGallery';

export const ProfileScreen = () => {
    const { galleryImages, refreshGallery, daysPath, userProfile, setUserProfile } = useChallengeStore();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        refreshGallery();
    }, [refreshGallery]);

    const completedDays = daysPath.filter(d => d.status === 'completed').length;
    const failedDays = daysPath.filter(d => d.status === 'failed').length;

    // Calculate Current Streak (naive: count backwards from today until not completed)
    // For MVP, just Total Completed is a good stat.

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

            <ProfileStats 
                completedDays={completedDays} 
                failedDays={failedDays} 
                totalPhotos={galleryImages.length} 
            />

            <ProgressGallery images={galleryImages} />

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
    editBadge: { marginTop: 15, paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#333', borderRadius: 20 },
    editText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});;
