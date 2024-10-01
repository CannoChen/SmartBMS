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
            "7": [],
        },
        // 缓冲区2，用于发送并存储到服务器端；
        dataCache: {
            "1": [],
            "2": [],
            "3": [],
            "4": [],
            "5": [],
            "6": [],
            "7": [],
        },
        isUploading: false, // 是否正在上传数据。注意，上传数据指的是所有单元的数据都上传；
        isOpen: false,      // 蓝牙是否关闭
        isConnected: false, // 是否连接
        isStopDynamicTest: true, // 是否停止动态工况测试
        device: null,       // 蓝牙设备
    },
    reducers: {
        // 状态管理
        on: (state) => {
            state.isOpen = true;
        },
        off: (state) => {
            state.isOpen = false;
        },
        connect: (state, action) => {
            state.isConnected = true;
            state.device = action.payload;
        },
        disconnect: (state) => {
            state.isConnected = false;
            state.isStopDynamicTest = false;
            state.device = null;
        },
        // 数据管理
        pushData: (state, action) => {
            // console.log(action.payload["id"])
            state.data[action.payload["id"]].push(action.payload);
            // console.log(state.data["1"]);
        },
        shift: state => {
          // state.data[action.payload.id].shift();
            console.log(`Before clear, length of data is ${state.data["1"].length}.`);
            for (let id in state.data)
                state.data[id].shift();
            console.log(`Before clear, length of data is ${state.data["1"].length}.`)
        },
        pushCache: (state, action) => {
            for (let id in action.payload) {
                state.dataCache[id].push(action.payload[id]);
                state.dataCache[id] = state.dataCache[id].flat(2);
            }
            // state.dataCache[action.payload.id].push(action.payload)
            // state.dataCache.push(action.payload);
            // console.log(state.dataCache["1"]);
            console.log(`bluetoothSlice::pushCache`);
        },
        clearCache: (state) => {
            state.data = {
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": [],
                "7": [],
            };
            state.dataCache = {
                "1": [],
                "2": [],
                "3": [],
                "4": [],
                "5": [],
                "6": [],
                "7": [],
            };
        },
        stopDynamicTest: (state) => {
            state.isStopDynamicTest = true;
        },
        startDynamicTest: (state) => {
            state.isStopDynamicTest = false;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(sendDataToServer.pending, state => {
                state.isUploading = true;
            })
            .addCase(sendDataToServer.fulfilled, (state, action) => {
                if (action.payload['type'] === 'success'){
                    console.log("BluetoothSlice::sendDataToServer.fulfilled");
                    const deleteCountList = action.payload["length"];
                    console.log(`Before clear, length of dataCache is ${state.dataCache["1"].length}.`);
                    console.log(`deleteCountList: ${deleteCountList}`);
                    for (let id in deleteCountList)  // 清空缓存
                        state.dataCache[id].splice(0, deleteCountList[id]);
                    console.log(`After clear, length of dataCache is ${state.dataCache["1"].length}.`);
                    state.isUploading = false;
                }
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
        // console.log(`BluetoothSlice::sendDataToServer ${SERVER_URL + ':' + PORT +'/bluetooth/store'}`);
        let dataList = []
        let lengthDict = {}
        for (let id in dataById) {
            dataList.push(dataById[id]);
            // console.log(dataById)
            lengthDict[id] = dataById[id].flat(2).length;
        }
        try {
            const response = await axios.post(
                // 'http://192.168.1.105:8099/bluetooth/store',
                SERVER_URL + ':' + PORT +'/bluetooth/store',
                {
                    "dataList": dataList.flat(2)
                },
                {timeout: 10000}
            );

            // console.log(`BluetoothSlice::sendDataToServer result: ${response}`);

            return {
                "type": "success",
                "info": "Send data successful.",
                "length": lengthDict,
                "result": response.data,
            };
        } catch (err) {
            console.log("BluetoothSlice::sendDataToServer error", err);
            return {
                "type": "fault",
                "info": `${err}`,
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
    stopDynamicTest,
    startDynamicTest,
    clearCache,
} = BluetoothSlice.actions;
export { sendDataToServer, dataAndCacheSelector };
