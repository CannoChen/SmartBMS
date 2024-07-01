import React, {useCallback, useEffect, useState} from 'react';
import {NavigationContainer, useFocusEffect} from "@react-navigation/native";

import MainScreen from "./src/view/screen/MainScreen";
import {Provider} from "react-redux";
import {
    GestureHandlerRootView,
} from 'react-native-gesture-handler';
// store customize reducer
import store from "./src/config/redux-store";


/**
 * 版本: 0.1
 * 作者: Zeyang Chen
 * 日期: 2024-06-29
 * 说明：
 * - 实现了基本的电池管理数字孪生框架；
 * - 使用模拟数据，还没有实现与单片机的通讯；
 * - 还没有加入深度学习功能；
 * 版本: 0.2（开发阶段）
 * 作者: Zeyang Chen
 * 日期: -
 * 说明：
 * - 实现与单片机蓝牙的通讯（待实现）；
 * - 实现深度学习功能（待实现）；
 * @returns {JSX.Element}
 * @constructor
 */
export default function App() {
    return (
        <Provider store={store}>
            <Index/>
        </Provider>
    );
}

function Index() {
    return (

        <GestureHandlerRootView>
            <NavigationContainer>
                <MainScreen />
            </NavigationContainer>
        </GestureHandlerRootView>
    );
}


