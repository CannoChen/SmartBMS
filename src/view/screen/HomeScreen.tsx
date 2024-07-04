import * as React from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import { Card, Text } from '@rneui/themed';

import HeaderComponent from "../component/HeaderComponent";
import DynamicDataPlotComponent from "../component/DataPlotComponent";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {useBluetoothState} from "../../service/hooks/bluetoothHooks.ts";
import {connect} from "../../service/bluetooth.ts";
import RNBluetoothClassic from "react-native-bluetooth-classic";

/**
 * 主屏幕导航
 * 版本：0.2
 * 作者：Zeyang Chen
 * 日期：2024-06-30
 * 功能：
 * - 页面之间的导航（已完成）
 * - 蓝牙的扫描与连接（已完成）
 *
 * 版本：0.3（开发阶段）
 * 作者：Zeyang Chen
 * 日期：-
 * 增添功能：
 * - 实现读取json格式的蓝牙数据块（已完成）
 * - 实现蓝牙状态的全局管理（未完成）
 * - 简化代码，代码复用（未完成）
 * @constructor
 */
const HomeScreen = () => {
    // 创建变量
    const [isOPen, isConnected] = useBluetoothState();
    const dispatch = useDispatch();

    // 经典蓝牙连接逻辑
    useEffect(() => {
        RNBluetoothClassic.isBluetoothEnabled().then(() => {
            console.log('蓝牙适配器准备完毕！');
        });
        // 判断手机是否成功启动蓝牙
        const enabledSubscription = RNBluetoothClassic.onBluetoothEnabled(() => {
            dispatch({type: "bluetooth/on"});
        });
        const disabledSubscription = RNBluetoothClassic.onBluetoothDisabled(() => {
            dispatch({type: "bluetooth/off"});
        });
        // const readDataInterval = setInterval(readData, 100);
        return () => {
            // 清理监听器
            enabledSubscription.remove();
            disabledSubscription.remove();
        };
    }, []);

    return (
      <SafeAreaView style={styles.container}>
          <HeaderComponent showName={"Overview"}/>
          <ScrollView>
              <Card>
                  <Card.Title>BATTERY DATA</Card.Title>
                  <Card.Divider />
                  <Text style={styles.fonts}>
                      Voltage: 12.6V
                  </Text>
                  <Text style={styles.fonts}>
                      Current Output: 30A
                  </Text>
                  <Text style={styles.fonts}>
                      State of Charge(SoC): 92%
                  </Text>
                  <Card.Divider />
                  <Text style={styles.fonts}>
                      Cell Max Voltage: 3.54V
                  </Text>
                  <Text style={styles.fonts}>
                      Cell Min Voltage: 3.33V
                  </Text>

                  <TouchableOpacity onPress={connect}>
                      <Text>Connect to BMS</Text>
                  </TouchableOpacity>
              </Card>

              <Card>
                  <Card.Title>RUNNING INFORMATION</Card.Title>
                  <Card.Divider />
                  <Text style={styles.fonts}>
                      Dynamic Data Figure
                  </Text>
                  <DynamicDataPlotComponent/>
              </Card>
          </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fonts: {
        marginBottom: 8,
    },
});

export default HomeScreen;
