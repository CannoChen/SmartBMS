import React, { useRef, useEffect, useState } from 'react';
import * as echarts from 'echarts/core';
import {BarChart, LineChart} from 'echarts/charts';
import {
    GridComponent,
    ToolboxComponent,
    LegendComponent,
    TooltipComponent,
    DataZoomComponent,
} from 'echarts/components';
import { SVGRenderer, SkiaChart, SvgChart } from '@wuba/react-native-echarts';

import {
    View,
    Dimensions,
    StyleSheet,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {
    dataAndCacheSelector,
    pushCache,
    sendDataToServer,
    shift
} from "../../service/slice/BlutoothSlice.ts";

echarts.use([
    SVGRenderer,
    LineChart,
    GridComponent,
    BarChart,
    ToolboxComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
]);

const E_HEIGHT = 400;
const E_WIDTH = Dimensions.get('screen').width;

const option = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#283b56',
            },
        },
    },
    legend: {},
    toolbox: {
        show: true,
        feature: {
            dataView: { show: false, readOnly: false },
            restore: {},
        },
    },
    dataZoom: {
        show: false,
        start: 0,
        end: 100,
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: true,
            data: [],
        },
    ],
    yAxis: [
        {
            type: 'value',
            // scale: true,
            name: 'Volt 1',
            max: 4.0,
            min: 0.0,
            // boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            // scale: true,
            name: 'Volt 2',
            max: 4.0,
            min: 0.0,
            // boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            // scale: true,
            name: 'Volt 3',
            max: 4.0,
            min: 0.0,
            // boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            // scale: true,
            name: 'Volt 4',
            max: 4.0,
            min: 0.0,
            // boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            // scale: true,
            name: 'Volt 5',
            // max: 4.0,
            // min: 0.0,
            // boundaryGap: [0.2, 0.2],
        },
        // {
        //     type: 'value',
        //     // scale: true,
        //     name: 'Order',
        //     max: 200,
        //     min: -200,
        //     // boundaryGap: [0.2, 0.2],
        // },
    ],
    series: [
        // {
        //     name: 'Dynamic Bar',
        //     type: 'bar',
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //     data: [],
        // },
        {
            name: 'Volt 1',
            type: 'line',
            data: []
        },
        {
            name: 'Volt 2',
            type: 'line',
            data: []
        },
        {
            name: 'Volt 3',
            type: 'line',
            data: []
        },
        {
            name: 'Volt 4',
            type: 'line',
            data: []
        },
        {
            name: 'Volt 5',
            type: 'line',
            data: []
        },
        // {
        //     name: 'valLow',
        //     type: 'line',
        //     data: [],
        // },
    ],
};  // option

/**
 * 版本：0.1
 * 作者：Zeyang Chen
 * 日期：2024-07-04
 * 功能：
 * - 绘制从蓝牙中接受到的数据（未实现）；
 *
 * 版本：0.2
 * 作者：Zeyang Chen
 * 日期：2024-07-19
 * 增加功能：
 * - 实现读取多个电池的信息；
 */
const CellsDataPlotComponent = () => {
    const svgRef = useRef(null);
    const chartRef = useRef(null);
    const dispatch = useDispatch();
    const {data, dataCache} = useSelector(dataAndCacheSelector);
    const isUploading = useSelector(state => state.bluetooth.isUploading);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (svgRef.current && !isInitialized) {
            const chart = echarts.init(svgRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
            chartRef.current = chart;
            setIsInitialized(true);
        }

        return () => {
            chartRef.current?.dispose();
            setIsInitialized(false);
        };
    }, []);

    useEffect(() => {
        if (!isInitialized || !chartRef.current) return;

        // 延迟处理，数据缓存中最少要留10个数据。
        for (let id in data) {
            if (data[id].length <= 15)
                return;
        }

        //缓冲区中有50个以上的数据，并且没有在上传数据，则继续上传缓冲区的数据
        let lengthList = Object.values(data).map(item => item.length)
        if (Math.min(...lengthList) >= 50 && !isUploadin)
            dispatch(sendDataToServer(dataCache));

        // 获取数据，这里暂时采用暴力的方法获取数据
        // step 1: 获取不同的电池
        const categoriesCur = data["1"].map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);
        // const categoriesCur_2 = data["2"].map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);
        // const categoriesCur_3 = data["3"].map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);
        // const categoriesCur_4 = data["4"].map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);
        // const categoriesCur_5 = data["5"].map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);

        // step 2: 获取不同电池的数据
        const volt_1 = data["1"].map(item => item.volt).slice(10 > data.length ? data.length : 10);
        const volt_2 = data["2"].map(item => item.volt).slice(10 > data.length ? data.length : 10);
        const volt_3 = data["3"].map(item => item.volt).slice(10 > data.length ? data.length : 10);
        const volt_4 = data["4"].map(item => item.volt).slice(10 > data.length ? data.length : 10);
        const volt_5 = data["5"].map(item => item.volt).slice(10 > data.length ? data.length : 10);

        // const categoriesCur = data.map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);
        // const volt = data.map(item => item.volt).slice(10 > data.length ? data.length : 10);

        // 绘制图像
        chartRef.current.setOption({
            xAxis: [
                { data: categoriesCur },
                // { data: categoriesCur },
            ],
            series: [
                {
                    name: "Volt 1",
                    data: volt_1
                },
                {
                    name: "Volt 2",
                    data: volt_2
                },
                {
                    name: "Volt 3",
                    data: volt_3
                },
                {
                    name: "Volt 4",
                    data: volt_4
                },
                {
                    name: "Volt 5",
                    data: volt_5
                },
                // { data: valHighCur },
                // { data: valLowCur },
            ],
        });
        // 执行数据更新
        dispatch(pushCache(data));
        dispatch(shift());
    }, [data]);

    return (
        <View style={styles.container}>
            <SvgChart ref={svgRef} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export {CellsDataPlotComponent};
