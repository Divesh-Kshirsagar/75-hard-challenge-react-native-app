import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { Save } from 'lucide-react-native';

export const JournalScreen = () => {
    const { currentDayId, getJournal, saveJournal } = useChallengeStore();
    const [note, setNote] = useState('');

    const loadNote = React.useCallback(async () => {
        const savedNote = await getJournal();
        if (savedNote) setNote(savedNote);
        else setNote('');
    }, [getJournal]);

    useEffect(() => {
        loadNote();
    }, [currentDayId, loadNote]);

    const handleSave = async () => {
        await saveJournal(note);
        Alert.alert("Saved", "Journal entry updated.");
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>DAILY JOURNAL</Text>
                <Text style={styles.subtitle}>Day {currentDayId}</Text>
            </View>

            <View style={styles.editorContainer}>
                <TextInput
                    style={styles.input}
                    multiline
                    placeholder="How was your discipline today?..."
                    placeholderTextColor="#666"
                    value={note}
                    onChangeText={setNote}
                    textAlignVertical="top"
                />
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Save color="#000" size={24} />
                <Text style={styles.saveText}>PROCEED TO SAVE</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#111' },
    title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
    subtitle: { color: '#888', marginTop: 5 },
    editorContainer: { flex: 1, padding: 20 },
    input: { flex: 1, color: '#fff', fontSize: 18, lineHeight: 28 },
    saveBtn: { 
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff', margin: 20, padding: 15, borderRadius: 30,
        gap: 10
    },
    saveText: { fontWeight: 'bold', fontSize: 16 }
});
