import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProfileScreen = () => (
    <View style={styles.container}>
        <Text style={styles.text}>Profile & Stats (Coming Soon)</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    text: { color: '#fff' }
});
