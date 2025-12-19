import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { Plus, Trash2, CheckSquare, Square, X } from 'lucide-react-native';

interface CustomTodoSectionProps {
  customTodos: any[];
}

export const CustomTodoSection = ({ customTodos }: CustomTodoSectionProps) => {
    const { addCustomTodo, toggleCustomTodo, deleteCustomTodo } = useChallengeStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');

    const handleAddTodo = async () => {
        if (newTitle.trim().length === 0) return;
        await addCustomTodo(newTitle, newDesc);
        setNewTitle('');
        setNewDesc('');
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>EXTRA TASKS</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addBtn}>
                    <Plus color="#fff" size={20} />
                </TouchableOpacity>
            </View>

            {/* Main Task List */}
            {customTodos.map(todo => (
                <View key={todo.id} style={styles.todoCard}>
                    <TouchableOpacity style={styles.todoHeader} onPress={() => toggleCustomTodo(todo.id)}>
                        <View style={{ marginRight: 10 }}>
                             {todo.completed ? <CheckSquare color="#00C851" size={24} /> : <Square color="#666" size={24} />}
                        </View>
                        
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.todoTitle, todo.completed && styles.strikethrough]}>{todo.title}</Text>
                            {todo.description ? <Text style={styles.todoDesc}>{todo.description}</Text> : null}
                        </View>

                        <TouchableOpacity onPress={() => deleteCustomTodo(todo.id)} style={{ padding: 5 }}>
                            <Trash2 color="#ff4444" size={18} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            ))}

            {/* Add Task Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>New Task</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <X color="#fff" size={24} />
                            </TouchableOpacity>
                        </View>
                        
                        <TextInput 
                            style={styles.input} 
                            placeholder="What do you need to do?" 
                            placeholderTextColor="#666"
                            value={newTitle}
                            onChangeText={setNewTitle}
                            autoFocus
                        />
                        <TextInput 
                            style={[styles.input, { height: 100, textAlignVertical: 'top' }]} 
                            placeholder="Description / Context (Optional)" 
                            placeholderTextColor="#666"
                            multiline
                            value={newDesc}
                            onChangeText={setNewDesc}
                        />
                        
                        <TouchableOpacity style={styles.saveBtn} onPress={handleAddTodo}>
                            <Text style={styles.saveBtnText}>CREATE TASK</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginTop: 30, marginBottom: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    addBtn: { backgroundColor: '#333', padding: 5, borderRadius: 5 },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#1E1E1E', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#333' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },

    input: { backgroundColor: '#222', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, fontSize: 16 },
    saveBtn: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
    saveBtnText: { fontWeight: 'bold', color: '#000', fontSize: 16 },

    // Todo List Styles
    todoCard: { backgroundColor: '#1E1E1E', borderRadius: 12, marginBottom: 10, overflow: 'hidden' },
    todoHeader: { flexDirection: 'row', alignItems: 'center', padding: 15 },
    todoTitle: { color: '#fff', fontSize: 16, fontWeight: '600' },
    todoDesc: { color: '#888', fontSize: 12, marginTop: 4 },
    strikethrough: { textDecorationLine: 'line-through', color: '#666' }
});
