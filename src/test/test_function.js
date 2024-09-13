dataById = {
    "1": [{data: 1}, {data: 2}, {data: 3}],
    "2": [{data: 4}, {data: 5}, {data: 6}],
};

dataList = [];

for (id in dataById) {
    dataList.push(...dataById[id]);
}

console.log(dataList)


// let res = Object.values(dataById).map(item => item.length)


// console.log(Math.min(...res));
