import {PermissionsAndroid, Platform} from 'react-native';
import {bleManager} from "../config/static_resources";

// const requestBluetoothPermission = async () => {
//     if (Platform.OS === 'ios') {
//         return true
//     }
//     if (Platform.OS === 'android' && PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION) {
//         const apiLevel = parseInt(Platform.Version.toString(), 10)
//
//         if (apiLevel < 31) {
//             const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
//             return granted === PermissionsAndroid.RESULTS.GRANTED
//         }
//         if (PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN && PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT) {
//             const result = await PermissionsAndroid.requestMultiple([
//                 PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//                 PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
//             ])
//
//             return (
//                 result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
//                 result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
//                 result['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
//             )
//         }
//     }
//     // this.showErrorToast('Permission have not been granted')
//     return false
// }

const scanBleDevices = async () => {
    const btState = await bleManager.state();
    console.log(`get bleManager's state:${btState}`);
    // Step 1: 测试蓝牙状态是否为powered on
    if (btState !== 'PoweredOn') {
        alert('Bluetooth is not powered on');
        return false;
    }
    // Step 2: 确定用户权限
    const permission = await requestBluetoothPermission();
    console.log(`permission is ${permission}`);
    if (permission) {
        bleManager.startDeviceScan(null, null, async (error, device) => {
            // error handling
            if (error) {
                console.log(error);
                return;
            }
            // Step 3: 寻找蓝牙设备
            console.log(`${device.name} (${device.id})`);
            if (device) {
                // if (device.name.includes('HC'))
                    console.log(`${device.name} (${device.id})`);
                // if (device.name !== null && device.name === 'HF-LPT270'){
                //     const newScannedDevices = scannedDevices;
                //     newScannedDevices[device.id] = device;
                //     setDeviceCount(Object.keys(newScannedDevices).length);
                // }
                // setScannedDevices(scannedDevices);
            }
        });  // bleManager.startDeviceScan()
    }
    return true;
}

export {scanBleDevices}
