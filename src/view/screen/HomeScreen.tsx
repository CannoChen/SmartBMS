import * as React from 'react';
import {
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity, View
} from "react-native";
import { Card, Text } from '@rneui/themed';

import HeaderComponent from "../component/HeaderComponent";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useBluetoothState} from "../../service/hooks/bluetoothHooks.ts";
import {
    disconnectToDevice,
    getConnectFunction,
    runDynamicTest,
    stopRunDynamicTest
} from "../../service/bluetooth.ts";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import {CellsDataPlotComponent} from "../component/CellsDataPlotComponent.tsx";
import {dataAndCacheSelector, off, on} from "../../service/slice/BlutoothSlice.ts";
import {AwesomeButton} from "../component/AwesomeButton.tsx";
import {loadTFLiteModel} from "../../service/slice/TFLiteSlice.ts";


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
    const isStopDynamicTest = useSelector(state => state.bluetooth.isStopDynamicTest)
    const device = useSelector(state => state.bluetooth.device);
    const data = useSelector(state => state.bluetooth.data);
    const model = useSelector(state => state.tflite.model);
    const dispatch = useDispatch();

    // 经典蓝牙连接逻辑
    useEffect(() => {
        dispatch(loadTFLiteModel())
        RNBluetoothClassic.isBluetoothEnabled().then(() => {
            console.log('蓝牙适配器准备完毕！');
        });
        // 判断手机是否成功启动蓝牙
        const enabledSubscription = RNBluetoothClassic.onBluetoothEnabled(() => {
            dispatch(on());
        });
        const disabledSubscription = RNBluetoothClassic.onBluetoothDisabled(() => {
            dispatch(off());
        });
        // const readDataInterval = setInterval(readData, 100);
        return () => {
            // 清理监听器
            enabledSubscription.remove();
            disabledSubscription.remove();
        };
    }, []);

    if (model)
        console.log(model);

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
                  <Card.Divider />
                  <View style={{marginBottom: 8}}>
                  {
                      isConnected ? (
                          <AwesomeButton title="Disconnect to BMS" onPress={
                              () => disconnectToDevice(device, data, dispatch)
                          } />
                      ) : (
                          <AwesomeButton title="Connect to BMS" onPress={getConnectFunction(dispatch)} />
                      )
                  }
                  </View>
                  <View>
                      {
                          isStopDynamicTest ? (
                              <AwesomeButton title="Run dynamic test" onPress={() => runDynamicTest(device, dispatch)} />
                          ) : (
                              <AwesomeButton title="Stop dynamic test" onPress={() =>
                                  stopRunDynamicTest(device, data, dispatch)} />
                          )
                      }
                  </View>
              </Card>

              <Card>
                  <Card.Title>RUNNING INFORMATION</Card.Title>
                  <Card.Divider />
                  <Text style={styles.fonts}>
                      Dynamic Data Figure
                  </Text>
                  {/*<DynamicDataPlotComponent/>*/}
                  <CellsDataPlotComponent/>
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
