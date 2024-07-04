import RNBluetoothClassic, {BluetoothDevice} from "react-native-bluetooth-classic";
import {PermissionsAndroid, Platform} from "react-native";
import {useDispatch} from "react-redux";

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
const connectToPeripheral = async (device: BluetoothDevice | null | undefined) => {
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

        initializeRead(device);
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
const connect = async () => {
    console.log("connect");
    await getBondedDevices()
        .then(device => startDiscovery(device))
        .then(device => connectToPeripheral(device));
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


export {
    requestBluetoothPermission,
    connect,
};
