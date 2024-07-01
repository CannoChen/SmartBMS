import React, {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    Platform
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from '@rneui/themed';

import HomeScreen from "./HomeScreen";
import SettingScreen from "./SettingScreen.tsx";
import DigitalTwinScreen from "./DigitalTwinScreen.tsx";
// import {bleManager} from "../../config/static_resources.tsx";
import {scanBleDevices} from "../../utils/utils.js";
import LoadingPageComponent from "../component/LoadingPageComponent.tsx";
import {useFocusEffect} from "@react-navigation/native";
import BleManager from "react-native-ble-manager";




const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

/**
 * 主导航界面
 * 版本：0.1
 * 日期：2024-05-28
 * 作者：Zeyang Chen
 * 功能：
 * - 在主界面、数字孪生、设置界面之间导航。
 * @constructor
 */
const MainScreen = () => {
    return (
        <>
            {/*<LoadingPageComponent />*/}
            <Tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({}) => {
                        const iconName = route.name;
                        if (iconName === "Home")
                            return (
                                <Icon
                                    name='home'
                                />
                            );
                        else if (iconName === "Details")
                            return (
                                <Icon
                                    name='monitor-dashboard'
                                    type='material-community'
                                />
                            );
                        else if (iconName === "Model")
                            return (
                                <Icon
                                    name='car-battery'
                                    type='material-community'
                                />
                            )
                        else
                            return (
                                <Icon
                                    name='cog'
                                    type='material-community'
                                />
                            );
                    },
                    tabBarInactiveTintColor: 'gray',
                    tabBarActiveTintColor: 'black',
                    headerShown: false,
                })}>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        headerLeft: null,
                        detachPreviousScreen: true,
                    }}
                />
                <Tab.Screen
                    name = "Model"
                    component={DigitalTwinScreen}
                />
                <Tab.Screen
                    name="Setting"
                    component={SettingScreen}
                />
            </Tab.Navigator>
        </>
    );
}

export default MainScreen;
