import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { Save, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AdService } from '../utils/AdService';

export const JournalScreen = () => {
    const navigation = useNavigation();
    const { currentDayId, getJournal, saveJournal } = useChallengeStore();
    const [note, setNote] = useState('');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const noteRef = React.useRef(note);

    const loadNote = React.useCallback(async () => {
        const savedNote = await getJournal();
        if (savedNote) {
            setNote(savedNote);
            noteRef.current = savedNote;
        } else {
            setNote('');
            noteRef.current = '';
        }
    }, [getJournal]);

    useEffect(() => {
        loadNote();
    }, [currentDayId, loadNote]);

    // Auto-save logic
    useEffect(() => {
        if (note === noteRef.current) return; // No change
        
        setSaveStatus('saving');
        const timer = setTimeout(async () => {
            await saveJournal(note);
            noteRef.current = note;
            setSaveStatus('saved');
        }, 500);

        return () => clearTimeout(timer);
    }, [note, saveJournal]);

    // Hardware Back Button & Cleanup
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
             if (note !== noteRef.current) {
                 saveJournal(note);
                 noteRef.current = note;
             }
        });
        return unsubscribe;
    }, [navigation, note, saveJournal]);


    return (
        <ImageBackground 
            source={require('../../../assets/journal.webp')} 
            style={styles.container}
            resizeMode="cover"
        >
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.glassContainer}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>DAILY JOURNAL</Text>
                    <Text style={styles.subtitle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <View style={styles.saveIndicator}>
                        {saveStatus === 'saving' && <Text style={styles.saveStatusText}>Saving...</Text>}
                        {saveStatus === 'saved' && <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}><Save color="#00C851" size={16} /><Text style={[styles.saveStatusText, {color: '#00C851'}]}>Saved</Text></View>}
                    </View>
                    <TouchableOpacity 
                        onPress={async () => {
                            await AdService.showInterstitial();
                            navigation.goBack();
                        }}
                        style={{ padding: 5 }}
                    >
                        <CheckCircle color="#fff" size={24} />
                    </TouchableOpacity>
                </View>
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
        </KeyboardAvoidingView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    glassContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.82)' },
    header: { padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 1 },
    subtitle: { color: '#888', marginTop: 5 },
    saveIndicator: { justifyContent: 'center' },
    saveStatusText: { color: '#888', fontSize: 14, fontWeight: '600' },
    editorContainer: { flex: 1, padding: 20 },
    input: { flex: 1, color: '#fff', fontSize: 18, lineHeight: 28 },
});
