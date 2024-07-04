import {useSelector} from "react-redux";

/**
 * 版本：.1
 * 作者：Zeyang chen
 * 日期：2024-07-04
 * 功能：
 * - 返回蓝牙适配器的状态，包括：蓝牙的开启状态(IsOpen)和蓝牙的连接状态(IsConnected)。
 */
const useBluetoothState = () => {
    const isOpen = useSelector(state => state.bluetooth.isOpen);
    const isConnected = useSelector(state => state.bluetooth.isConnected);

    return [isOpen, isConnected];
}

export {useBluetoothState};
