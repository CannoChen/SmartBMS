import {createSlice} from "@reduxjs/toolkit";


/**
 * 蓝牙状态管理
 * 版本：0.1
 * 作者：Zeyang Chen
 * 功能：
 * - 订阅蓝牙开关状态；
 * - 订阅蓝牙连接状态；
 */
const BluetoothSlice = createSlice({
    name: 'bluetooth',
    initialState: {
        isOpen: false,        // 蓝牙是否关闭
        isConnected: false,  // 是否连接
    },
    reducers: {
        on: (state) => {
            state.isOpen = true;
        },
        off: (state) => {
            state.isOpen = false;
        },
        connect: (state) => {
            state.isConnected = true;
        },
        disconnect: (state) => {
            state.isConnected = false;
        },
    },
    // extraReducers: builder => {
    //     builder
    //         .addCase();
    // },
});

export default BluetoothSlice.reducer;
