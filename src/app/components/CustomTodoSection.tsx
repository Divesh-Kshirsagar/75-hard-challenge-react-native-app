import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager, Modal, KeyboardAvoidingView } from 'react-native';
import { useChallengeStore } from '../../store/challengeStore';
import { ChevronDown, ChevronUp, Plus, Trash2, CheckSquare, Square, X } from 'lucide-react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface CustomTodoSectionProps {
  customTodos: any[];
}

export const CustomTodoSection = ({ customTodos }: CustomTodoSectionProps) => {
    const { addCustomTodo, toggleCustomTodo, deleteCustomTodo, addSubTask, toggleSubTask, deleteSubTask } = useChallengeStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [expandedTodoId, setExpandedTodoId] = useState<number | null>(null);
    const [newSubtaskMap, setNewSubtaskMap] = useState<{[key: number]: string}>({});

    const handleAddTodo = async () => {
        if (newTitle.trim().length === 0) return;
        await addCustomTodo(newTitle, newDesc);
        setNewTitle('');
        setNewDesc('');
        setIsModalVisible(false);
    };

    const toggleExpand = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedTodoId(expandedTodoId === id ? null : id);
    };

    const handleAddSubTask = async (todoId: number) => {
        const content = newSubtaskMap[todoId];
        if (content && content.trim().length > 0) {
            await addSubTask(todoId, content);
            setNewSubtaskMap({ ...newSubtaskMap, [todoId]: '' });
        }
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
            {customTodos.map(todo => {
                const isExpanded = expandedTodoId === todo.id;
                
                return (
                    <View key={todo.id} style={styles.todoCard}>
                        {/* Main Todo Row */}
                        <TouchableOpacity style={styles.todoHeader} onPress={() => toggleExpand(todo.id)}>
                            <TouchableOpacity onPress={() => toggleCustomTodo(todo.id)}>
                                {todo.completed ? <CheckSquare color="#00C851" size={24} /> : <Square color="#666" size={24} />}
                            </TouchableOpacity>
                            
                            <View style={{ flex: 1, marginLeft: 10 }}>
                                <Text style={[styles.todoTitle, todo.completed && styles.strikethrough]}>{todo.title}</Text>
                                {todo.description ? <Text style={styles.todoDesc} numberOfLines={1}>{todo.description}</Text> : null}
                            </View>

                            <TouchableOpacity onPress={() => deleteCustomTodo(todo.id)}>
                                <Trash2 color="#ff4444" size={18} />
                            </TouchableOpacity>
                            
                            <View style={{ marginLeft: 10 }}>
                                {isExpanded ? <ChevronUp color="#888" size={20} /> : <ChevronDown color="#888" size={20} />}
                            </View>
                        </TouchableOpacity>

                        {/* Expanded Section: Subtasks */}
                        {isExpanded && (
                            <View style={styles.subtaskSection}>
                                {todo.description ? (
                                    <Text style={styles.fullDesc}>{todo.description}</Text>
                                ) : null}
                                
                                <View style={styles.divider} />

                                {todo.subtasks && todo.subtasks.map((sub: any) => (
                                    <View key={sub.id} style={styles.subtaskRow}>
                                        <TouchableOpacity onPress={() => toggleSubTask(sub.id)}>
                                            {sub.completed ? <CheckSquare color="#00C851" size={18} /> : <Square color="#555" size={18} />}
                                        </TouchableOpacity>
                                        <Text style={[styles.subtaskText, sub.completed && styles.strikethrough]}>{sub.content}</Text>
                                        <TouchableOpacity onPress={() => deleteSubTask(sub.id)}>
                                             <Trash2 color="#444" size={14} />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <View style={styles.addSubtaskRow}>
                                    <TextInput 
                                        style={styles.subInput} 
                                        placeholder="Add subtask..." 
                                        placeholderTextColor="#555"
                                        value={newSubtaskMap[todo.id] || ''}
                                        onChangeText={(text) => setNewSubtaskMap({ ...newSubtaskMap, [todo.id]: text })}
                                    />
                                    <TouchableOpacity onPress={() => handleAddSubTask(todo.id)} style={styles.miniAdd}>
                                        <Plus color="#fff" size={16} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                );
            })}

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
    todoDesc: { color: '#888', fontSize: 12 },
    strikethrough: { textDecorationLine: 'line-through', color: '#666' },

    subtaskSection: { backgroundColor: '#161616', padding: 15 },
    fullDesc: { color: '#aaa', fontSize: 14, marginBottom: 10, fontStyle: 'italic' },
    divider: { height: 1, backgroundColor: '#333', marginBottom: 10 },
    
    subtaskRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    subtaskText: { color: '#ddd', flex: 1, marginLeft: 10, fontSize: 14 },
    
    addSubtaskRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    subInput: { flex: 1, backgroundColor: '#222', color: '#fff', padding: 8, borderRadius: 6, fontSize: 13 },
    miniAdd: { backgroundColor: '#333', padding: 8, borderRadius: 6, marginLeft: 10 }
});
