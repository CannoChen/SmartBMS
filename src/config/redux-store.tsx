import {configureStore} from '@reduxjs/toolkit';
import bluetoothReducer from "../service/slice/BlutoothSlice.ts";
import TFLiteSlice from "../service/slice/TFLiteSlice.ts";

const store = configureStore({
    reducer: {
        "bluetooth": bluetoothReducer,
        "tflite": TFLiteSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 禁用检查
        }),
});

export default store;
