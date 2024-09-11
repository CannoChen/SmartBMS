import {createAsyncThunk, createSelector, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {SERVER_URL, PORT} from "../../config/url_config.ts";


/**
 * 蓝牙状态管理
 * 版本：0.1
 * 作者：Zeyang Chen
 * 功能：
 * - 订阅蓝牙开关状态；
 * - 订阅蓝牙连接状态；
 *
 * 版本：0.2
 * 作者： Zeyang Chen
 * 日期：2024-07-19
 * 增加功能：
 * - 修正了只能存储一个电池的数据的问题；
 */
const BluetoothSlice = createSlice({
    name: 'bluetooth',
    initialState: {
        // 缓存区1, 用于存储蓝牙接收到的消息并且用于绘制在屏幕上；
        data: {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
        },
        // 缓冲区2，用于发送并存储到服务器端；
        dataCache: {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
        },
        isUploading: false, // 是否正在上传数据。注意，上传数据指的是所有单元的数据都上传；
        isOpen: false,      // 蓝牙是否关闭
        isConnected: false, // 是否连接
    },
    reducers: {
        // 状态管理
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
        // 数据管理
        pushData: (state, action) => {
            state.data[action.payload.id].push(action.payload)
        },
        shift: state => {
          // state.data[action.payload.id].shift();
            for (let id in state.data)
                state.data[id].shift();
        },
        pushCache: (state, action) => {
            // console.log("push 2");
            for (let id in action.payload)
                state.dataCache[id].push(action.payload[id])
            // state.dataCache[action.payload.id].push(action.payload)
            // state.dataCache.push(action.payload);
            console.log(`bluetoothSlice::pushCache`);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(sendDataToServer.pending, state => {
                state.isUploading = true;
            })
            .addCase(sendDataToServer.fulfilled, (state, action) => {
                console.log("BluetoothSlice::sendDataToServer.fulfilled");
                const deleteCountList = action.payload.length;
                for (let id in deleteCountList)  // 清空缓存
                    state.dataCache[id].splice(0, deleteCountList[id])
                // state.dataCache.splice(0, deleteCount);  // 清空缓存
                state.isUploading = false;
                // state.cur = state.cur - 50;    // 设置绘图指示器
            })
            .addCase(sendDataToServer.rejected, (state, action) => {
                console.log("BluetoothSlice::sendDataToServer.rejected");
                console.log(action.payload);
            })
    }
});

const dataSelector = state => state.bluetooth.data;
// const curSelector = state => state.bluetooth.cur;

const dataCacheSelector = state => state.bluetooth.dataCache;


const dataAndCacheSelector = createSelector(
    [dataSelector, dataCacheSelector],
    (data, dataCache)=> {return {data, dataCache}}
);



/**
 * 版本：0.1
 * 作者：Zeyang Chen
 * 日期：-
 * 功能：
 * - 当缓冲区数据满的时候，发送数据给服务器，并清空缓冲区；
 */
const sendDataToServer = createAsyncThunk(
    "bluetooth/sendData",
    async dataById => {
        console.log(`BluetoothSlice::sendDataToServer ${SERVER_URL + ':' + PORT +'/bluetooth/store'}`);

        let dataList = []
        let lengthDict = {}
        for (let id in dataById) {
            dataList.push(dataById[id]);
            lengthDict[id] = dataById[id].length;
        }
        try {
            const response = await axios.post(
                // 'http://192.168.1.105:8099/bluetooth/store',
                SERVER_URL + ':' + PORT +'/bluetooth/store',
                {
                    "dataList": dataList.flat(2)
                },
                {timeout: 2000}
            );

            console.log(`BluetoothSlice::sendDataToServer result: ${response}`);

            return {
                type: "success",
                info: "Send data successful.",
                length: lengthDict,
                result: response.data,
            };
        } catch (err) {
            console.log("BluetoothSlice::sendDataToServer error", err);
            return {
                type: "fault",
                info: `${err}`,
            }
        }
    }
);

export default BluetoothSlice.reducer;
export const {
    on,
    off,
    connect,
    disconnect,
    pushData,
    shift,
    pushCache,
} = BluetoothSlice.actions;
export { sendDataToServer, dataAndCacheSelector };
