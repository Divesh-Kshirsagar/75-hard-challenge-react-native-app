import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { X } from 'lucide-react-native';

interface FullScreenImageModalProps {
    visible: boolean;
    imageUri: string | null;
    onClose: () => void;
}

export const FullScreenImageModal = ({ visible, imageUri, onClose }: FullScreenImageModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.fsOverlay}>
                <TouchableOpacity style={styles.fsClose} onPress={onClose}>
                        <X color="#fff" size={30} />
                </TouchableOpacity>
                {imageUri && (
                    <Image 
                        source={{ uri: imageUri }} 
                        style={styles.fsImage} 
                        resizeMode="contain"
                    />
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    fsOverlay: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    fsClose: { position: 'absolute', top: 50, right: 30, zIndex: 10 },
    fsImage: { width: '100%', height: '80%' }
});
