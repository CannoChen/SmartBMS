import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";


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
        data: [],           // 缓存数据, 存储1000个数据发送一次
        cur: 0,             // 绘图指示器，指示DataPlotComponent目前运行绘制的数据点
        isOpen: false,      // 蓝牙是否关闭
        isConnected: false, // 是否连接
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
    extraReducers: builder => {
        builder
            .addCase(sendDataToServer.pending, () => {})
            .addCase(sendDataToServer.fulfilled, (state) => {
                state.data = [];  // 清空缓存
                state.cur = 0;    // 设置绘图指示器
            })
            .addCase(sendDataToServer.rejected, () => {})
    }
});

/**
 * 版本：0.1
 * 作者：Zeyang Chen
 * 日期：-
 * 功能：
 * - 当缓冲区数据满的时候，发送数据给服务器，并清空缓冲区；
 */
const sendDataToServer = createAsyncThunk(
    "bluetooth/sendData",
    async (state) => {
        // 与服务器通讯的逻辑

        return true;
    }
);

export default BluetoothSlice.reducer;
