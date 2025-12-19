import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RULES = [
    "2 Workouts (45m each)",
    "1 Gallon of Water",
    "10 Pages Reading",
    "Follow a Diet",
    "No Alcohol / Cheat Meals",
    "Take a Progress Pic"
];

export const RuleList = () => {
    return (
        <View style={styles.rules}>
            {RULES.map((rule, index) => (
                <Text key={index} style={styles.rule}>• {rule}</Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    rules: { marginBottom: 50 },
    rule: { color: '#ccc', fontSize: 16, marginBottom: 10 },
});
