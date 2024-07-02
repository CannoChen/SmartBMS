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
import {useEffect, useState} from "react";
import RNBluetoothClassic, {BluetoothDevice, BluetoothDeviceEvent} from 'react-native-bluetooth-classic';
import {requestBluetoothPermission} from "../../service/bluetooth.js";

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
 * @constructor
 */
const HomeScreen = () => {
    // 创建变量
    const [isConnected, setIsConnected] = useState(false);
    const [peripheral, setPeripheral] = useState(null);  // 临时设备存储
    const [readSubscription, setReadSubscription] = useState(null);

    // 经典蓝牙连接逻辑
    useEffect(() => {
        // 判断手机蓝牙是否开启
        RNBluetoothClassic.isBluetoothEnabled().then(() => {
            console.log('蓝牙开启！');
        });
        // 判断手机是否成功启动蓝牙
        const enabledSubscription = RNBluetoothClassic.onBluetoothEnabled(() => {
            console.log("蓝牙开启成功！");
        });
        const disabledSubscription = RNBluetoothClassic.onBluetoothDisabled(() => {
            console.log("蓝牙关闭！")
        });
        // const readDataInterval = setInterval(readData, 100);
        return () => {
            // 清理监听器
            enabledSubscription.remove();
            disabledSubscription.remove();
        };
    }, []);

    /**
     * 版本：0.1
     * 日期：2024-06-30
     * 功能：
     * - 获取已经绑定的设备集合（未完成，还没有确定获取到的设备信息应该如何保存）
     */
    const getBondedDevices = async (unloading) => {
        console.log("HomeScreen::getBondedDevices");
        try {
            const bonded = await RNBluetoothClassic.getBondedDevices();
            console.log('已绑定设备：', bonded);
        } catch (error) {

        }
    }

    /**
     * 版本：0.1
     * 日期：2024-06-30
     * 功能：
     * - 扫描经典蓝牙信号。
     */
    const startDiscovery = async () => {
        try {
            const granted = await requestBluetoothPermission();
            if (!granted) {
                throw new Error(`Access fine location was not granted`);
            }

            let devices = [];

            try {
                const unpaired = await RNBluetoothClassic.startDiscovery();
                for(const device of unpaired) {
                    console.log(device.name);
                    if (device.name === 'HC-05') {
                        return device;
                    }
                }
            } finally {
                // 状态更新
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 版本：0.1
     * 日期：2024-06-30
     * 功能：
     * - 连接BMS控制单元
     *
     * 版本：0.2
     * 日期：2024-06-30
     * 功能：
     * - 连接BMS控制单元
     * - 解耦蓝牙扫描与蓝牙连接逻辑
     */
    const connectToPeripheral = async (device: BluetoothDevice) => {
        if(device === null) // 如果设备还没有扫描到，则退出连接
            return;

        console.log("connectToPeripheral")
        try {
            const connection = await device.connect();
            if (!connection) {
                throw new Error("HomeScreen::蓝牙配对失败");
            }
            else {
                console.log("HomeScreen::蓝牙配对成功");
            }

            initializeRead(device);
        } catch (error) {
            console.log(error);
        }
    }

    const connect = async () => {
        console.log("connect");
        await startDiscovery().then(device => connectToPeripheral(device));
    }

    /**
     * 版本：0.1
     * 日期：2024-06-30
     * 功能：
     * - 初始化读取蓝牙信号，包括两种方式：1) 通过read()函数；2) 通过onDataReceived()函数
     * - device.read()
     * - device.onDataReceived()
     */
    const initializeRead = (device: BluetoothDevice) => {
        if (device === null)
            return

        console.log("initializeRead");
        const disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(
            () =>device.disconnect()
        );
        // 方法一：
        const readInterval = setInterval(() => performRead(device), 100);
        // 方法二：不可用
        // const readSubscription = device.onDataReceived(
        //     event => console.log(device.read())
        // );
    }

    /**
     * 版本：0.1
     * 日期：2024-06-30
     * 功能：
     * - 读取蓝牙数据。
     */
    const performRead = async (device: BluetoothDevice) =>  {
        if (device === null)
            return;

        // console.log("performRead");
        try {
            // 测试代码，请勿删除！！！
            // console.log('Polling for available messages');
            let available = await device.available();
            // console.log(`There is data available [${available}], attempting read`);

            if (available > 0) {
                for (let i = 0; i < available; i++) {
                    // console.log(`reading ${i}th time`);
                    let data = await device.read();
                    if (data) {  // 如果数据不为空，则解析数据
                        let parsedData = parseReceivedData(data);

                        // console.log(`Read data ${data}`);
                        if (parsedData !== null)
                            console.log(parsedData);
                    }
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    /**
     * 版本：0.1
     * 日期：2024-07-01
     * 功能：
     * - 解析蓝牙接收数据。
     */
    const parseReceivedData = (data: String) => {
        const regex = /\$\#s000(\d+)\$\#s001([^\$]+)\$\#s002([^\$]+)\$\#s003([^\$]+)\$/;
        const match = data.match(regex);
        if (match !== null) {
            // console.log("id: ", parseInt(match[1], 10));
            // console.log("name: ", match[2]);
            // console.log("data: ", parseFloat(match[3]));
            return {
                valHigh: parseFloat(match[1]),
                valLow: parseFloat(match[2]),
                temp1: parseFloat(match[3]),
                temp2: parseFloat(match[4]),
            };
        } else {
            // console.log('数据不匹配：', data);
            return null;
        }
    }

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
