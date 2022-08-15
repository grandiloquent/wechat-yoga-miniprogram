// const shared = require('../../shared');

const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];

function applyBasicSettings() {
    wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })
}


function createUrl(app, query, obj) {
    let url = `${app.globalData.host}/api/${query}?`;
    for (const key in obj) {
        url += `&${key}=${obj[key]}`
    }
    return url;
}


function execute(page, path, query, fn) {
    let p = '';
    if (query && query.length) {
        const parameters = [];
        for (let index = 0; index < query.length; index += 2) {
            parameters.push(`${query[index]}=${query[index + 1]}`);
        }
        p = `&${parameters.join('&')}`;
    }
    wx.request({
        url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}${p}`,
        success: res => {
            if (res.statusCode === 200) {
                fn && fn(res.data)
            } else if (res.statusCode === 204) {
                fn && fn()
            } else {
                wx.showToast({
                    title: "网络不稳定",
                    icon: "error"
                })
            }
        },
        fail: err => {
            wx.showToast({
                title: "网络不稳定",
                icon: "error"
            })
        }
    })
}

function fetch(page, path, query, key) {
    let p = '';
    if (query && query.length) {
        const parameters = [];
        for (let index = 0; index < query.length; index += 2) {
            parameters.push(`${query[index]}=${query[index + 1]}`);
        }
        p = `&${parameters.join('&')}`;
    }
    wx.request({
        url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}${p}`,
        success: res => {
            if (res.statusCode === 200) {
                key && page.setData({
                    [key]: res.data
                });
            } else if (res.statusCode === 204) {
                key && page.setData({
                    [key]: []
                });
            } else {
                wx.showToast({
                    title: "网络不稳定",
                    icon: "error"
                })
            }
        },
        fail: err => {
            wx.showToast({
                title: "网络不稳定",
                icon: "error"
            })
        }
    })
}

function fetchAsync(page, path, query) {
    let p = '';
    if (query && query.length) {
        const parameters = [];
        for (let index = 0; index < query.length; index += 2) {
            parameters.push(`${query[index]}=${query[index + 1]}`);
        }
        p = `&${parameters.join('&')}`;
    }
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}${p}`,
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else if (res.statusCode === 204) {
                    resolve([]);
                } else {
                    reject(res.statusCode);
                }
            },
            fail: err => {
                reject();
            }
        })
    })
}

function fetchData(url, action) {
    wx.request({
        url,
        success: res => {
            action(res.data)
        },
        fail: err => {
        }
    })
}

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
        }, {})
}

function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}

function getAsync() {
}


function getRandomColor() {
    return colors[getRandomInt(0, colors.length)];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}


function getStringAsync() {
}


async function getUserInfo(app) {
    if (app.globalData.userInfo) {
        return;
    }
    try {
        const res = await new Promise((resolve, reject) => {
            wx.request({
                url: `${app.globalData.host}/api/user/${app.globalData.openid}?mode=3`,
                success: res => {
                    if (res.statusCode <= 299 && res.statusCode >= 200)
                        resolve(res.data);
                    else
                        reject(res.statusCode)
                },
                fail: err => {
                    reject(err);
                }
            });
        });
        app.globalData.userInfo = res;
    } catch (error) {
        wx.showToast({
            title: "无法加载数据",
            icon: 'error'
        })
    }
}


function loadData(page, url, key, action) {
    fetchData(url, (data) => {
        page.setData({
            [key]: action ? action(data) : data
        })
    })
}


function parseDate(string) {
    const match = /(\d{4})[年-](\d{1,2})[月-](\d{1,2})/.exec(string);
    const now = new Date(match[1], parseInt(match[2]) - 1, match[3]);
    return now;
}

function parseTime(s) {
    const match = /(\d+):(\d+)/.exec(s);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function patchAsync() {
}

function post(page, path, obj, fn) {
    wx.request({
        url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}`,
        method: 'POST',
        data: obj,
        success: res => {
            if (res.statusCode === 200) {
                fn && fn(res.data)
            } else if (res.statusCode === 204) {
                fn && fn();
            } else {
                wx.showToast({
                    title: "网络不稳定",
                    icon: "error"
                })
            }
        },
        fail: err => {
            wx.showToast({
                title: "网络不稳定",
                icon: "error"
            })
        }
    })
}


async function request(url, ...arg) {
    return await new Promise((resolve, reject) => {
        wx.request(Object.assign({}, {
                url,
                success: res => {
                    if (res.statusCode <= 299 && res.statusCode >= 200)
                        resolve(res.data);
                    else
                        reject(res.statusCode)
                },
                fail: err => {
                    reject(err);
                }
            },
            ...arg,
        ));
    });
}

function send(page, path, obj, fn) {
    wx.request({
        url: `${page.data.app.globalData.host}/api/${path}`,
        data: Object.assign({}, {
            openId: page.data.app.globalData.openid
        }, obj),
        success: res => {
            if (res.statusCode === 200) {
                fn && fn(res.data)
            } else if (res.statusCode === 204) {
                fn && fn();
            } else {
                wx.showToast({
                    title: "网络不稳定",
                    icon: "error"
                })
            }
        },
        fail: err => {
            wx.showToast({
                title: "网络不稳定",
                icon: "error"
            })
        }
    })
}


function signIn(app, reservedId) {
    return new Promise((resolve, reject) => {
        wx.scanCode({
            success: async response => {
                try {
                    wx.showLoading({
                        title: "加载中..."
                    })
                    const res = await request(
                        `${app.globalData.host}/api/book?reservedId=${reservedId}&mode=1&fulfill=1&${response.result}`
                    )
                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            },
            fail: err => {
                reject(err);
            }
        });
    })
}

function groupBy(data, keyFn) {
    let m = new Map();

    for (let x of data) {
        let k = keyFn(x);
        if (!m.has(k))
            m.set(k, []);
        m.get(k).push(x);
    }

    return m;
}

function transform(input) {
    Object.values(input)[0]
        .map((_, i) => Object.keys(input)
            .reduce((prev, curr) => {
                prev[curr] = input[curr][i]
                return prev
            }, {}))
}

function getShortDateString(seconds) {
    const t = new Date(seconds * 1000);
    return `${t.getMonth() + 1}月${t.getDate()}日周${'日一二三四五六'[t.getDay()]}`;
}

function secondsToDuration(seconds) {
    return `${(seconds / 3600) | 0}:${(seconds % 3600 / 60).toString().padStart(2, '0')}`
}

module.exports = {
    applyBasicSettings,
    execute,
    fetch,
    fetchAsync,
    fetchData,
    fuzzysearch,
    getAsync,
    getRandomColor,
    getStringAsync,
    getUserInfo,
    loadData,
    parseDate,
    parseTime,
    patchAsync,
    post,
    request,
    send,
    signIn,
    groupByKey,
    groupBy,
    transform, getShortDateString, secondsToDuration
};

/*
function loadData(url, key, page, obj) {
    wx.request({
        url,
        ...obj,
        success: res => {
            if (res.statusCode <= 299 && res.statusCode >= 200) {
                if (key && {}.toString.call(key) === '[object Function]') {
                    key(res.data)
                } else {
                    page.setData({
                        [key]: res.data
                    })
                }
            } else {
                console.log(res.statusCode);
                wx.showToast({
                    title: "网络不稳定",
                    icon: 'error'
                })
            }
        },
        fail: err => {
            wx.showToast({
                title: "网络不稳定",
                icon: 'error'
            })
        }
    });
}
 */