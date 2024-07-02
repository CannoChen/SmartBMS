// import React, { useRef, useEffect, useState } from 'react';
// import * as echarts from 'echarts/core';
// import {BarChart, LineChart} from 'echarts/charts';
// import {
//     GridComponent,
//     ToolboxComponent,
//     LegendComponent,
//     TooltipComponent,
//     DataZoomComponent,
// } from 'echarts/components';
// import { SVGRenderer, SkiaChart, SvgChart } from '@wuba/react-native-echarts';
//
// import {
//     View,
//     Dimensions,
//     StyleSheet,
// } from "react-native";
// // deprecated
// import { CartesianChart, Line } from "victory-native";
//
// // Load resource file
// import inter from "../../../assets/inter-medium.ttf";
// import {useFont} from "@shopify/react-native-skia";
// import skiaChart from "@wuba/react-native-echarts/src/skiaChart";
//
//
// function* makeRangeIterator(data, start = 0, end = Infinity, step = 1) {
//     let iterationCount = 0;
//     for (let i = start; i < end; i += step) {
//         iterationCount++;
//         yield {
//             second: i,
//             current: data[i],
//         };
//     }
//     return iterationCount;
// }
//
// echarts.use([
//     SVGRenderer,
//     LineChart,
//     GridComponent,
//     BarChart,
//     ToolboxComponent,
//     TooltipComponent,
//     LegendComponent,
//     DataZoomComponent,
// ]);
//
// const E_HEIGHT = 400;
// const E_WIDTH = Dimensions.get('screen').width;
//
// const categories = (function () {
//     let now = new Date();
//     let res = [];
//     let len = 10;
//     while (len--) {
//         res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
//         now = new Date(+now - 2000);
//     }
//     return res;
// })();  // categories
// const categories2 = (function () {
//     let res = [];
//     let len = 10;
//     while (len--) {
//         res.push(10 - len - 1);
//     }
//     return res;
// })();  // categories2
// const data = (function () {
//     let res = [];
//     let len = 10;
//     while (len--) {
//         res.push(Math.round(Math.random() * 1000));
//     }
//     return res;
// })();  // data
// const data2 = (function () {
//     let res = [];
//     let len = 0;
//     while (len < 10) {
//         res.push(+(Math.random() * 10 + 5).toFixed(1));
//         len++;
//     }
//     return res;
// })();  // data2
// const option = {
//     tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//             type: 'cross',
//             label: {
//                 backgroundColor: '#283b56',
//             },
//         },
//     },
//     legend: {},
//     toolbox: {
//         show: true,
//         feature: {
//             dataView: { show: false, readOnly: false },
//             restore: {},
//         },
//     },
//     dataZoom: {
//         show: false,
//         start: 0,
//         end: 100,
//     },
//     xAxis: [
//         {
//             type: 'category',
//             boundaryGap: true,
//             data: categories,
//         },
//         {
//             type: 'category',
//             boundaryGap: true,
//             data: categories2,
//         },
//     ],
//     yAxis: [
//         {
//             type: 'value',
//             scale: true,
//             name: 'Price',
//             max: 30,
//             min: 0,
//             boundaryGap: [0.2, 0.2],
//         },
//         {
//             type: 'value',
//             scale: true,
//             name: 'Order',
//             max: 1200,
//             min: 0,
//             boundaryGap: [0.2, 0.2],
//         },
//     ],
//     series: [
//         {
//             name: 'Dynamic Bar',
//             type: 'bar',
//             xAxisIndex: 1,
//             yAxisIndex: 1,
//             data: data,
//         },
//         {
//             name: 'Dynamic Line',
//             type: 'line',
//             data: data2,
//         },
//     ],
// };  // option
//
// const DynamicDataPlotComponent = () => {
//     const svgRef = useRef(null);
//
//     useEffect(() => {
//         let chart: any;
//         let inter: any;
//         if (svgRef.current) {
//             chart = echarts.init(svgRef.current, 'light', {
//                 renderer: 'svg',
//                 width: E_WIDTH,
//                 height: E_HEIGHT,
//             });
//             chart.setOption(option);
//
//             let count = 11;
//             inter = setInterval(function () {
//                 let axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');
//
//                 data.shift();
//                 data.push(Math.round(Math.random() * 1000));
//                 data2.shift();
//                 data2.push(+(Math.random() * 10 + 5).toFixed(1));
//
//                 categories.shift();
//                 categories.push(axisData);
//                 categories2.shift();
//                 categories2.push(count++);
//
//                 chart.setOption({
//                     xAxis: [
//                         {
//                             data: categories,
//                         },
//                         {
//                             data: categories2,
//                         },
//                     ],
//                     series: [
//                         {
//                             data: data,
//                         },
//                         {
//                             data: data2,
//                         },
//                     ],
//                 });
//             }, 2100);
//         }
//         return () => {
//             chart?.dispose();
//             clearInterval(inter);
//         };
//     }, []);
//     return (
//         <View style={styles.container}>
//             <SvgChart ref={svgRef} />
//         </View>
//     );
// }
//
// // deprecated
// const DataPlotByECharts = () => {
//     const skiaRef = useRef<any>(null);
//     useEffect(() => {
//         const option = {
//             xAxis: {
//                 type: 'category',
//                 data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//             },
//             yAxis: {
//                 type: 'value',
//             },
//             series: [
//                 {
//                     data: [150, 230, 224, 218, 135, 147, 260],
//                     type: 'line',
//                 },
//             ],
//         }; // const option
//         let chart: any;
//         if (skiaRef.current) {
//             chart = echarts.init(skiaRef.current, 'light', {
//                 renderer: 'svg',
//                 width: 300,
//                 height: 400,
//             });
//             chart.setOption(option);
//         }
//         return () => chart?.dispose();
//     }, []);
//
//     return <SkiaChart ref={skiaRef} />;
// }
//
//
//
// // deprecated
// const DataPlotComponentTest = () => {
//     // State
//     const [data, setData] = useState([]);
//     const [allData, setAllData] = useState(require("../../test/test_sample_2.json").data);
//     const [index, setIndex] = useState(0);
//     const [DATA, setDATA] = useState([{second: 0, current: 0}]);
//     const font = useFont(inter, 12);
//
//
//     // Effect
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (allData.length >= 10)
//                 updateData();  // update number array
//         }, 3000);
//         return () => clearInterval(interval);
//     }, [allData]);
//
//     useEffect(() => {
//         updateDATA();
//     }, [data]);
//
//     // update object array
//     const updateDATA = () => {
//         if (data.length > 0)
//             setDATA(() => {
//                 const output = Array.from({ length: data.length}, (_, i) => ({
//                     second: i,
//                     current: data[i],
//                 }));
//                 allData.splice(0, 10);
//                 console.log("=============updateDATA()===================");
//                 console.log(output);
//                 return output;
//             });
//     }
//
//     // update array
//     const updateData = () => {
//         console.log("=============start: updateData()===================");
//         setData(() => {
//             const newData = data.concat(allData.slice(0, 10));
//             setIndex(index + 10);  // update Index
//             if (newData.length > 50)
//                 newData.splice(0, 10);
//             console.log("=============updateData()===================");
//             console.log(newData);
//             return newData;
//         });
//     }
//     return (
//         <View style={{ height: 300 }}>
//             <CartesianChart
//                 data={DATA} // 👈 specify your data
//                 xKey="second" // 👈 specify data key for x-axis
//                 yKeys={["current"]} // 👈 specify data keys used for y-axis
//                 axisOptions={{ font }} // 👈 we'll generate axis labels using given font.
//             >
//                 {/* 👇 render function exposes various data, such as points. */}
//                 {({ points }) => (
//                     // 👇 and we'll use the Line component to render a line path.
//                     <Line points={points.current} color="red" strokeWidth={3} />
//                 )}
//             </CartesianChart>
//         </View>
//     );
// }
//
// // deprecated
// const DataPlotComponent_backup = () => {
//
//     const test_sample = require("../../test/test_sample_2.json");
//     const data = Array.from(test_sample["data"])
//     const iter = makeRangeIterator(data, 0);
//
//     const DATA = Array.from({ length: data.length },
//         (_, i) => iter.next().value);
//
//     const font = useFont(inter, 12);
//
//     return (
//         <View style={{ height: 300 }}>
//             <CartesianChart
//                 data={DATA} // 👈 specify your data
//                 xKey={"second"} // 👈 specify data key for x-axis
//                 yKeys={["current"]} // 👈 specify data keys used for y-axis
//                 axisOptions={{ font }} // 👈 we'll generate axis labels using given font.
//             >
//                 {/* 👇 render function exposes various data, such as points. */}
//                 {({ points }) => (
//                     // 👇 and we'll use the Line component to render a line path.
//                     <Line points={points.current} color="red" strokeWidth={3} />
//                 )}
//             </CartesianChart>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
//
// export default DataPlotComponent_backup;
// export { DataPlotComponentTest, DataPlotByECharts, DynamicDataPlotComponent };
