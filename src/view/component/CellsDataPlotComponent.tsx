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
            max: 4.0,
            min: 0.0,
            // boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            name: 'Volt 6',
            max: 4.0,
            min: 0.0,
        },
        {
            type: 'value',
            name: 'Volt 7',
            max: 4.0,
            min: 0.0,
        }
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
        {
            name: 'Volt 6',
            type: 'line',
            data: []
        },
        {
            name: 'Volt 7',
            type: 'line',
            data: []
        }
        // {
        //     name: 'valLow',
        //     type: 'line',
        //     data: [],
        // },
    ],
};  // option

const option_2 = {
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
            name: 'SoC(%)',
            min: 0,
            max: 100,
        },
    ],
    series: [
        {
            name: 'SoC(%)',
            type: 'line',
            data: []
        },
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
    const svgRef_2 = useRef(null);
    const chartRef_2 = useRef(null);
    const dispatch = useDispatch();
    const {data, dataCache} = useSelector(dataAndCacheSelector);
    const isUploading = useSelector(state => state.bluetooth.isUploading);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (svgRef.current || svgRef_2.current && !isInitialized) {
            const chart = echarts.init(svgRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            const chart_2 = echarts.init(svgRef_2.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
            chart_2.setOption(option_2);
            chartRef.current = chart;
            chartRef_2.current = chart_2;
            setIsInitialized(true);
        }

        return () => {
            chartRef.current?.dispose();
            chartRef_2.current?.dispose();
            setIsInitialized(false);
        };
    }, []);

    useEffect(() => {
        if (!isInitialized || !chartRef.current || !chartRef_2.current) return;

        // 延迟处理，数据缓存中最少要留15个数据。
        for (let id in data) {
            if (data[id].length <= 15)
                return;
        }

        //缓冲区中有50个以上的数据，并且没有在上传数据，则继续上传缓冲区的数据
        let lengthList = Object.values(data).map(item => item.length)
        if (Math.min(...lengthList) >= 15 && !isUploading){
            dispatch(sendDataToServer(dataCache));
        }


        // 获取数据，这里暂时采用暴力的方法获取数据
        const ids = Object.keys(data)
        const series = []
        const series_2 = []

        // step 1: 获取时间轴
        // const categoriesCur = data["1"].map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);

        // step 2: 获取电流数据
        // const current = data["1"].map(item => item.current_mA.slice(10)).slice(10 > data.length ? data.length : 10);
        // series.push({
        //     name: 'Current(A)',
        //     data: current,
        // })

        // step 1: 获取时间轴、电流、SoC数据
        const categoriesCur: number[] = []
        const current: number[] = []
        const soc_perc: number[] = [];
        const soc_Ah: number[] = [];
        data["1"].slice(10 > data["1"].length ? data["1"].length : 10).forEach(item => {
            categoriesCur.push(item.timeStamp)
            // current.push(item.current_mA)
            soc_perc.push(item.soc_perc);
            // soc_Ah.push(item.soc_Ah);
        });
        // series.push({
        //     name: 'Current(A)',
        //     data: current,
        // })
        series_2.push({
            name: 'SoC(%)',
            data: soc_perc
        });
        // console.log(soc_perc)
        // series_2.push({
        //     name: 'SoC(Ah)',
        //     data: soc_Ah
        // });


        // step 2: 获取不同电池的数据
        ids.forEach(id => {
            const volt = data[id].map(item => item.volt).slice(10 > data.length ? data.length : 10);
            series.push({
                name: `Volt ${id}`,
                data: volt
            })
        })

        // const categoriesCur = data.map(item => item.timeStamp.slice(10)).slice(10 > data.length ? data.length : 10);
        // const volt = data.map(item => item.volt).slice(10 > data.length ? data.length : 10);

        // 绘制图像
        chartRef.current.setOption({
            xAxis: [
                { data: categoriesCur },
                // { data: categoriesCur },
            ],
            series: series
        });
        chartRef_2.current.setOption({
            xAxis: [
                {data: categoriesCur},
                // { data: categoriesCur },
            ],
            series: series_2
        });
        // 执行数据更新
        dispatch(pushCache(data));
        dispatch(shift());
    }, [data]);  // useEffect

    return (
        <View style={styles.container}>
            <SvgChart ref={svgRef} />
            <SvgChart ref={svgRef_2}/>
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
