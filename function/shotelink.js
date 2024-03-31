const axios = require('axios');

async function shortlink(url, custompath, transfer) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'http://gg.gg/create',
            data: `custom_path=${custompath}&use_norefs=0&long_url=${encodeURIComponent(url)}&app=site&version=0.1`
        }).then((response) => {
            const rdata = {
                link: response.data,
                transfer: transfer,
                time : Math.round(new Date().getTime() / 1000)
            }

            resolve(rdata);
        });
    })
};

async function checklink(url, custompath, transfer) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: 'http://gg.gg/check',
            data: `custom_path=${custompath}&use_norefs=${transfer}&long_url=${encodeURI(url)}&app=site&version=0.1`
        }).then((response) => {
            if (response.data == "Link with this path already exist. Choose another path.") {
                resolve("Link with this path already exist. Choose another path.");
            } else {
                resolve(response.data);
            }
        });
    });
}


module.exports = {
    checklink,
    shortlink
}