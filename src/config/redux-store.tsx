import {configureStore} from '@reduxjs/toolkit';
import bluetoothReducer from "../service/slice/BlutoothSlice.ts";

const store = configureStore({
    reducer: {
        "bluetooth": bluetoothReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 禁用检查
        }),
});

export default store;
