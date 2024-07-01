import React from 'react'
import HeaderComponent from "../component/HeaderComponent.tsx";
import CarModelComponent from "../component/CarModelComponent.tsx";
import { CellsInfoComponent } from "../component/CellsInfoComponent.tsx";
import {
    StyleSheet, useWindowDimensions,
    View,
} from "react-native";
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from "react-native-reanimated";
import { height } from "../../config/static_resources.tsx";


const DigitalTwinScreen = ({navigation}) => {
    const endTranslationY = useSharedValue(0);
    const startTranslationY = useSharedValue(0);
    const showCellInfo = useSharedValue(true);
    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: withTiming(showCellInfo.value ? height * 0.5 : 50, { duration: 300 }), // 使用 height 控制显示和隐藏
            overflow: 'hidden', // 防止内容溢出
        };
    });


    const pan = Gesture.Pan()
        .minDistance(30)
        .onStart((event) => {
            startTranslationY.value = event.translationY;
        })
        .onUpdate((event) => {
            endTranslationY.value = event.translationY;
            if (endTranslationY.value - startTranslationY.value < 0) {
                console.log('上滑');
                showCellInfo.value = true;
            }
            else if (endTranslationY.value - startTranslationY.value > 0) {
                console.log("下滑");
                showCellInfo.value = false;
            }
        })
        .runOnJS(true);

    return (
        <GestureDetector gesture={pan}>
            <View style={styles.container}>
                <HeaderComponent showName={"Digital Twin"}/>
                <CarModelComponent/>
                <Animated.View style={[animatedStyles]}>
                    <CellsInfoComponent/>
                </Animated.View>
            </View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
});

export default DigitalTwinScreen;
