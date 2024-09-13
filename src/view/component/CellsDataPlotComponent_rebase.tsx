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
import {addCur, dataAndCurSelector} from "../../service/slice/BlutoothSlice.ts";

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
            name: 'Price',
            // max: 200,
            // min: -200,
            // boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            // scale: true,
            name: 'Order',
            max: 200,
            min: -200,
            // boundaryGap: [0.2, 0.2],
        },
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
            name: 'valHigh',
            type: 'line',
            data: []
        },
        {
            name: 'valLow',
            type: 'line',
            data: [],
        },
    ],
};  // option

/**
 * 版本：0.1
 * 作者：Zeyang Chen
 * 日期：2024-07-04
 * 功能：
 * - 绘制从蓝牙中接受到的数据（未实现）；
 */
const CellsDataPlotComponent = () => {
    const svgRef = useRef(null);
    const dispatch = useDispatch();
    const {data, cur} = useSelector(dataAndCurSelector);

    useEffect(() => {
        let chart: any;
        if (svgRef.current) {
            chart = echarts.init(svgRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }

        return () => {
            chart?.dispose();
        };
    }, []);

    useEffect(() => {
        console.log(`CellsDataPlotComponent::data: ${data.length}`);
        if (!svgRef.current) {
            console.log("if (!svgRef.current)");
            return;
        }
        const chart = echarts.getInstanceByDom(svgRef.current);
        if (chart === null || chart === undefined) {
            console.log(chart);
            return;
        }
        // if (data.length === 0) return;

        const categoriesCur = data.map(item => item.timeStamp).slice(cur, data.length < (cur + 10) ? data.length : (cur + 10));
        const valHighCur = data.map(item => item.valHigh).slice(cur, data.length < (cur + 10) ? data.length : (cur + 10));
        const valLowCur = data.map(item => item.valLow).slice(cur, data.length < (cur + 10) ? data.length : (cur + 10));

        dispatch(addCur());

        console.log(`CellsDataPlotComponent::valHighCur: ${valHighCur}`);

        chart.setOption({
            xAxis: [
                { data: categoriesCur },
                { data: categoriesCur },
            ],
            series: [
                { data: valHighCur },
                { data: valLowCur },
            ],
        });
        return () => {
            chart?.dispose();
        };
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
