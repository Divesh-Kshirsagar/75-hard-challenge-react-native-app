import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AdService } from '../../utils/AdService';

export const BannerAd = () => {
    if (!AdService.shouldShowBanner()) return null;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.text}>ADVERTISEMENT (320x50)</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent'
    },
    content: {
        width: 320,
        height: 50,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#444'
    },
    text: {
        color: '#888',
        fontSize: 10,
        letterSpacing: 2
    }
});
