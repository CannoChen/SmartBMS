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
import {useDispatch} from "react-redux";

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
let bearingDataset = require("../../test/test_sample_2.json").data;
let bearingData = bearingDataset.slice(10);
bearingDataset = bearingDataset.splice(0, 10);

const categories = (function () {
    let now = new Date();
    let res = [];
    let len = 10;
    while (len--) {
        res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
        now = new Date(+now - 2000);
    }
    return res;
})();  // categories

const categories2 = (function () {
    let res = [];
    let len = 10;
    while (len--) {
        res.push(10 - len - 1);
    }
    return res;
})();  // categories2

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
            data: categories,
        },
        {
            type: 'category',
            boundaryGap: true,
            data: categories2,
        },
    ],
    yAxis: [
        {
            type: 'value',
            // scale: true,
            name: 'Price',
            // max: 200,
            // min: -200,
            boundaryGap: [0.2, 0.2],
        },
        {
            type: 'value',
            // scale: true,
            name: 'Order',
            max: 200,
            min: -200,
            boundaryGap: [0.2, 0.2],
        },
    ],
    series: [
        {
            name: 'Dynamic Bar',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: bearingData,
        },
        {
            name: 'Dynamic Line',
            type: 'line',
            data: bearingData,
        },
    ],
};  // option

/**
 * 动态绘图组件
 * 版本：0.1
 * 日期：2024-06-01
 * 作者：Zeyang Chen
 * 功能：
 * - 将模拟数据以动态的形式展示。
 *
 * 版本：0.2
 * 日期：-
 * 作者：Zeyang Chen
 * 增添功能：
 * - 展示蓝牙传输的数据（未完成）
 * @constructor
 */
const DynamicDataPlotComponent = () => {
    const svgRef = useRef(null);

    useEffect(() => {
        let chart: any;
        let inter: any;
        if (svgRef.current) {
            chart = echarts.init(svgRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);

            let count = 11;
            inter = setInterval(function () {
                let axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');

                // data.shift();
                // data.push(Math.round(Math.random() * 1000));

                bearingData.shift();
                bearingData.push(bearingDataset[0]).toFixed(1);
                bearingDataset.shift();
                // data2.shift();
                // data2.push(+(Math.random() * 10 + 5).toFixed(1));

                categories.shift();
                categories.push(axisData);
                categories2.shift();
                categories2.push(count++);

                chart.setOption({
                    xAxis: [
                        {
                            data: categories,
                        },
                        {
                            data: categories2,
                        },
                    ],
                    series: [
                        {
                            data: bearingData,
                        },
                        {
                            data: bearingData,
                        },
                    ],
                });
            }, 1000);
        }
        return () => {
            chart?.dispose();
            clearInterval(inter);
        };
    }, []);

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

export default DynamicDataPlotComponent;
