import {createSlice} from "@reduxjs/toolkit";


const BluetoothSlice = createSlice({
    name: 'bluetooth',
    initialState: {
        device: null,  // HC-05蓝牙模块
        data: [], //蓝牙传输的数据，缓存大小设置为100
        isConnection: false,  // 是否连接


    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase();
    },
});
