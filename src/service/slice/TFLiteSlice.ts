import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import * as tf from '@tensorflow/tfjs';
import {
    bundleResourceIO,
} from '@tensorflow/tfjs-react-native';


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
            await tf.ready();
            // Load my model.
            // https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
            console.log("开始读取tflite模型！！！");
            const modelJson = require("../../../public/my_tflite_model/model.json");
            const modelWeights1 = require("../../../public/my_tflite_model/group1-shard1of8.bin");
            const modelWeights2 = require("../../../public/my_tflite_model/group1-shard2of8.bin");
            const modelWeights3 = require("../../../public/my_tflite_model/group1-shard3of8.bin");
            const modelWeights4 = require("../../../public/my_tflite_model/group1-shard4of8.bin");
            const modelWeights5 = require("../../../public/my_tflite_model/group1-shard5of8.bin");
            const modelWeights6 = require("../../../public/my_tflite_model/group1-shard6of8.bin");
            const modelWeights7 = require("../../../public/my_tflite_model/group1-shard7of8.bin");
            const modelWeights8 = require("../../../public/my_tflite_model/group1-shard8of8.bin");
            const ioHandler = bundleResourceIO(modelJson, [
                modelWeights1,
                modelWeights2,
                modelWeights3,
                modelWeights4,
                modelWeights5,
                modelWeights6,
                modelWeights7,
                modelWeights8,
            ]);
            const model = await tf.loadLayersModel(ioHandler);
            console.log("tflite模型读取完毕！！！");
            const test_data = tf.randomNormal([1, 2048, 18])
            console.log("开始测试")
            const startTime = new Date().getTime();
            for (let i=0; i<1000 ;i++){
                const res = model.predict(test_data) as tf.Tensor;
            }
            const endTime = new Date().getTime();
            console.log(`测试结束: ${(endTime - startTime) / 1000}`)

            return {
                "type": "success",
                "model": undefined,
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
