import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Image } from 'react-native';
import { X, Check } from 'lucide-react-native';

const COLORS = [
    'ff4444', // Red
    '33b5e5', // Blue
    '00C851', // Green
    'ffbb33', // Orange
    'aa66cc', // Purple
    '2BBBAD', // Teal
    '3F729B', // Dark Blue
    '212121', // Black
];

interface AvatarSelectorProps {
    visible: boolean;
    onClose: () => void;
    onSave: (name: string, color: string) => void;
    currentName: string;
    currentColor: string;
}

export const AvatarSelector = ({ visible, onClose, onSave, currentName, currentColor }: AvatarSelectorProps) => {
    const [name, setName] = useState(currentName);
    const [color, setColor] = useState(currentColor);

    const handleSave = () => {
        if (name.trim().length > 0) {
            onSave(name, color);
            onClose();
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Edit Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.previewContainer}>
                        <Image 
                            source={{ uri: `https://ui-avatars.com/api/?name=${name || 'User'}&background=${color}&size=128` }}
                            style={styles.avatarPreview}
                        />
                    </View>

                    <Text style={styles.label}>DISPLAY NAME</Text>
                    <TextInput 
                        style={styles.input} 
                        value={name} 
                        onChangeText={setName} 
                        placeholder="Enter Name" 
                        placeholderTextColor="#666" 
                        maxLength={12}
                    />

                    <Text style={styles.label}>THEME COLOR</Text>
                    <View style={styles.colorsGrid}>
                        {COLORS.map(c => (
                            <TouchableOpacity 
                                key={c} 
                                style={[styles.colorOption, { backgroundColor: `#${c}` }, color === c && styles.colorSelected]}
                                onPress={() => setColor(c)}
                            >
                                {color === c && <Check color="#fff" size={16} />}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveText}>SAVE CHANGES</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
    container: { backgroundColor: '#1E1E1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 500 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    previewContainer: { alignItems: 'center', marginBottom: 30 },
    avatarPreview: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
    label: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
    input: { backgroundColor: '#111', color: '#fff', padding: 15, borderRadius: 12, fontSize: 16, marginBottom: 30, borderWidth: 1, borderColor: '#333' },
    colorsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginBottom: 40 },
    colorOption: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    colorSelected: { borderWidth: 2, borderColor: '#fff' },
    saveButton: { backgroundColor: '#fff', padding: 18, borderRadius: 30, alignItems: 'center', marginTop: 'auto' },
    saveText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});
