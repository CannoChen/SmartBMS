import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios/index";
import {PORT, SERVER_URL} from "../../config/url_config.ts";
import * as tf from '@tensorflow/tfjs';
import {loadTensorflowModel} from "react-native-fast-tflite";


const TFLiteSlice = createSlice({
    name: 'tflite',
    initialState: {
        model: null,
    },
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(loadTFLiteModel.pending, state => {
                console.log("loadTFLiteModel.pending")
            })
            .addCase(loadTFLiteModel.fulfilled, (state, action) => {
                if (action.payload['type'] === 'success')
                    state.model = action.payload['model']
            })
            .addCase(loadTFLiteModel.rejected, (state, action) => {
                console.log("loadTFLiteModel.rejected");
            })
    }
});


const loadTFLiteModel = createAsyncThunk(
    "tflite/loadTFLiteModel",
    async state => {
        try {
            const model = await loadTensorflowModel(require('assets/models/tflite_model.tflite'))
            return {
                "type": "success",
                "model": model,
            }
        } catch (err) {
            console.log("TFLiteSlice::loadTFLiteModel error", err);
            return {
                "type": "fault",
                "info": `${err}`,
            }
        }
    }
);


export default TFLiteSlice.reducer;
export { loadTFLiteModel };
