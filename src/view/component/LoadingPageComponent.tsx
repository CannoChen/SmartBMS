import {StyleSheet, View, ActivityIndicator, Text} from 'react-native';
import React from 'react';

import {width, height} from "../../config/static_resources.tsx";


/**
 * 作者: Zeyang Chen
 * 日期：2024-06-29
 * 功能：当蓝牙未连接时，展示此页面。
 * @constructor
 */
export default function LoadingPageComponent() {
    console.log('LoadingPage():');
    return (
        <View style={styles.load_page_style}>
            <View style={styles.loading_content_style}>
                <ActivityIndicator size="large" color="#FFF" />
                <Text style={{marginLeft: 10, color: '#FFF', marginTop: 10}}>
                    Loading...
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loading_content_style: {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.6)',
        opacity: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
    },
    load_page_style: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: width - 25,
        height: height / 2,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
});
