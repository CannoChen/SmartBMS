import {configureStore} from '@reduxjs/toolkit';
import bluetoothReducer from "../service/slice/BlutoothSlice.ts";

const store = configureStore({
    reducer: {
        "bluetooth": bluetoothReducer,
    },
});

export default store;
