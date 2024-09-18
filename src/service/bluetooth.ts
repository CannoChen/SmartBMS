import RNBluetoothClassic, {BluetoothDevice} from "react-native-bluetooth-classic";
import {PermissionsAndroid, Platform} from "react-native";
import {Dispatch} from "@reduxjs/toolkit";
import {
    pushData,
    connect,
    disconnect,
    stopDynamicTest,
    startDynamicTest,
    sendDataToServer, clearCache
} from "./slice/BlutoothSlice.ts";
import moment from "moment/moment";

const requestBluetoothPermission = async () => {
    if (Platform.OS === 'ios') {
        return true
    }
    if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
        const apiLevel = parseInt(Platform.Version.toString(), 10)

        if (apiLevel < 31) {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            return granted === PermissionsAndroid.RESULTS.GRANTED
        }
        if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
            const result = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            ])

            return (
                result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
                result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
            )
        }
    }
    // this.showErrorToast('Permission have not been granted')
    return false
}

/**
 * 版本：0.1
 * 作者：Zeyang Chen
 * 日期：2024-06-30
 * 功能：
 * - 获取已经绑定的设备集合（未完成，还没有确定获取到的设备信息应该如何保存）
 *
 * 版本：0.2
 * 作者：Zeyang Chen
 * 日期：2024-07-04
 * 增添功能：
 * - 获取已经绑定的设备集合；
 * - 如果已经绑定了HC05模块，则返回。
 */
const getBondedDevices = async () => {
    let hc05 = null;
    console.log("bluetooth.ts::getBondedDevices");
    try {
        const bonded = await RNBluetoothClassic.getBondedDevices();
        for (const device of bonded)
            if (device.name === 'HC-05') {
                hc05 = device
                break;
            }
        return hc05;
        // console.log('已绑定设备：', bonded);
    } catch (error) {
        console.log(error);
        return hc05;
    }
}

/**
 * 版本：0.1
 * 日期：2024-06-30
 * 功能：
 * - 扫描经典蓝牙信号。
 */
const startDiscovery = async (device: BluetoothDevice | null) => {
    if (device)
        return device;

    let hc05 = null;
    try {
        const granted = await requestBluetoothPermission();
        if (!granted) {
            throw new Error(`Access fine location was not granted`);
        }
        try {
            const unpaired = await RNBluetoothClassic.startDiscovery();
            for(const device of unpaired) {
                console.log(device.name);
                if (device.name === 'HC-05') {
                    hc05 = device;
                    return hc05;
                }
            }
        } finally {
            // 状态更新
        }
    } catch (error) {
        console.log(error);
        return hc05;
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
const connectToPeripheral = async (device: BluetoothDevice | null | undefined, dispatch: Dispatch) => {
    if(device === null || device === undefined) // 如果设备还没有扫描到，则退出连接
        return;  // 状态更新

    console.log("connectToPeripheral")
    try {
        const connection = await device.connect();
        if (!connection) {
            throw new Error("bluetooth.ts::蓝牙配对失败");
        }
        else {
            console.log("bluetooth.ts::蓝牙配对成功");
        }
        dispatch(connect(device))

        initializeRead(device, dispatch);
    } catch (error) {
        console.log(error);
    }
}

/**
 * 版本：0.1
 * 日期：2024-06-30
 * 功能：
 * - 连接蓝牙设备
 */
const connectToDevice = async (dispatch: Dispatch) => {
    console.log("connectToDevice");
    await getBondedDevices()
        .then(device => startDiscovery(device))
        .then(device => connectToPeripheral(device, dispatch));
}

const disconnectToDevice = async (device: BluetoothDevice, dispatch: Dispatch) => {
    console.log("disconnectToDevice");
    try {
        const disconnected = await device.disconnect();
        if (disconnected)
            dispatch(disconnect());
        else
            throw new Error("bluetooth.ts::蓝牙设备断开失败！");
    } catch (error) {
        console.log(error)
    }
}

/**
 * 版本：0.1
 * 日期：2024-07-04
 * 功能：
 * - 装饰器设计模式，获取连接蓝牙的函数。
 */
const getConnectFunction = (dispatch: Dispatch) => {
    return () => connectToDevice(dispatch);
}

/**
 * 版本：0.1
 * 日期：2024-06-30
 * 功能：
 * - 初始化读取蓝牙信号，包括两种方式：1) 通过read()函数；2) 通过onDataReceived()函数
 * - device.read()
 * - device.onDataReceived()
 */
const initializeRead = (device: BluetoothDevice, dispatch: Dispatch) => {
    if (device === null)
        return

    console.log("initializeRead");
    const disconnectSubscription = RNBluetoothClassic.onDeviceDisconnected(
        () =>device.disconnect()
    );
    // 方法一：
    const readInterval = setInterval(() => performRead(device, dispatch), 100);
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
const performRead = async (device: BluetoothDevice, dispatch: Dispatch) =>  {
    if (device === null)
        return;
    try {
        let available = await device.available();

        if (available > 0) {
            // console.log(`----------available: ${available}-------------`);
            for (let i = 0; i < available; i++) {
                let data = await device.read();
                if (data) {  // 如果数据不为空，则解析数据
                    let parsedData = parseReceivedData(data);
                    if (parsedData !== null) {  // 解析成功
                        // console.log(parsedData);
                        dispatch(pushData(parsedData));
                    }
                }
            }
        } // if (available > 0)
    } catch (err) {
        console.log(err);
    }
}

interface DataDictionary {
    [key: string]: any[];
}


const stopRunDynamicTest = async (device: BluetoothDevice, data: DataDictionary, dispatch: Dispatch) => {
    if (device === null)
        return;
    try {
        const result = await device.write("#$stop\n");
        if (result) {
            console.log(`result: ${result}`);
            console.log("暂停动态工况测试成功！");
            dispatch(stopDynamicTest());  // 暂停工况发送
            dispatch(sendDataToServer(data));
            dispatch(clearCache());
        } else
            throw new Error("bluetooth.ts::暂停动态工况测试失败！")
    } catch (err) {
        console.log(err);
    }
}

const runDynamicTest = async (device: BluetoothDevice, dispatch: Dispatch) => {
    if (device === null)
        return;
    try {
        const result = await device.write("#$run\n");
        if (result) {
            console.log("运行动态工况测试成功！")
            dispatch(startDynamicTest())
        }
        else
            throw new Error("bluetooth.ts::运行动态工况测试失败！")
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

/**
 * 版本：0.1
 * 日期：2024-07-01
 * 功能：
 * - 解析蓝牙接收数据。
 *
 * 版本：0.2
 * 日期：2024-09-11
 * 功能：
 * - 增加解析数据内容，包括 current_mA, soc_perc, soc_mAh。
 */
const parseReceivedData = (data: String): receivedData | null => {
    // const regex = /\$\#s000(\d+)\$\#s001([^\$]+)\$\#s002([^\$]+)\$\#s003([^\$]+)\$/;
    const regex = /\[([^\$]+)\]\$\#s001([^\$]+)\$\#s002([^\$]+)\$\#s003([^\$]+)\$\#s110([^\$]+)\$\#s111([^\$]+)\$\#s112([^\$]+)\$/;
    const match = data.match(regex);
    if (match !== null) {
        const data_received = {
            id: parseInt(match[1], 10),
            volt: parseFloat(match[2]),
            pole_temp: parseInt(match[3], 10),
            bal_temp: parseInt(match[4], 10),
            current_A: parseFloat(match[5]) / 1000,
            soc_perc: parseFloat(match[6]),
            soc_mAh: parseFloat(match[7]),
            timeStamp: getCurrentFormattedTime(),
        };
        // console.log(`current_mA: ${data_received.current_mA} soc_perc: ${data_received.soc_perc}
        //                 soc_mAh: ${data_received.soc_mAh}`)
        // console.log(`id ${data_received.id} volt: ${data_received.volt}`)
        return data_received;
    } else {
        // console.log('数据不匹配：', data);
        return null;
    }
}

/**
 * 版本：0.1
 * 作者：Zeyang Chen
 * 日期：2024-07-09
 * 功能：
 * 获取格式化时间，如“2024-07-09 15:40:54”。
 */
const getCurrentFormattedTime = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};

// 蓝牙数据格式
type receivedData = {
    id: number
    volt: number,
    pole_temp: number,
    bal_temp: number
    current_A: number,
    soc_perc: number,
    soc_mAh: number,
    timeStamp: string,
};

export {
    requestBluetoothPermission,
    getConnectFunction,
    stopRunDynamicTest,
    runDynamicTest,
    connectToDevice,
    disconnectToDevice
};
