const axios = require('axios');
const moment = require('moment');

const getCurrentFormattedTime = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
};
//
// console.log(getCurrentFormattedTime().slice(10));

// // const date = new Date();
// console.log(new Date().toLocaleTimeString().replace(/^\D*/, ''));
// console.log(new Date().toLocaleTimeString());
//
//
const data = [
    {
        milliVolt: 5.0,
        temp1: 110,
        temp2: 120,
        timeStamp: getCurrentFormattedTime(),
    },
    {
        milliVolt: 4.0,
        temp1: 111,
        temp2: 122,
        timeStamp: getCurrentFormattedTime(),
    },
]

const test_axios = async () => {
    const response = await axios.post(
        'http://localhost:8099/bluetooth/store',
        {
            dataList: data,
        },
        {timeout: 5000}
    );
    // console.log(response);
}

test_axios().catch( error => console.log(error));

