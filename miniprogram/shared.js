// const shared = require('../../shared');

const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];
function applyBasicSettings() {
    wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })
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
function fetchToken(app) {
    if (app.globalData.userInfo && app.globalData.token) {
        return Promise.resolve();
    }
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/login.token?openid=${app.globalData.openid}`,
            success: res => {
                app.globalData.userInfo = res.data;
                app.globalData.token = res.header.Token;
                resolve();
            },
            fail: err => {
                reject(err)
            }
        })
    }))
}
function formatLessons(lessons) {
    if (!lessons || !lessons.length) return [];
    const lessonGroups = groupByKey(lessons, 'date_time');
    const seconds = new Date().setHours(0, 0, 0, 0) / 1000;
    const times = Math.floor(new Date().setSeconds(0, 0) / 1000) - seconds;
    return Object.entries(lessonGroups).map(x => {
        x[0] = getShortDateString(x[0])
        x[1] = x[1].sort((x, y) => {
            return x.start_time - y.start_time
        })
        for (const lesson of x[1]) {
            // if (lesson.course_id === 429) {
            //     //lesson.reservation_id = 1;
            //     lesson.position = 1;
            //     lesson.peoples = 0;
            //     lesson.start_time = 16 * 3600;
            //     lesson.end_time = 17 * 3600;
            // }
            if (lesson.hidden === 2) {
                lesson.mode = -1;
            } else if (lesson.date_time < seconds || (lesson.date_time === seconds &&
                lesson.end_time <= times)) {
                lesson.mode = -2;
            } else if (lesson.start_time > times && lesson.start_time - times <= 3600) {
                lesson.mode = -3;
            } else if (lesson.end_time > times && lesson.end_time - times <= 3600) {
                lesson.mode = -4;
            } else if (lesson.reservation_id) {
                if (lesson.start_time > times && lesson.start_time - times > 3600 * 3) {
                    if (lesson.position > lesson.peoples)
                        lesson.mode = 2;
                    else
                        lesson.mode = 1;
                } else {
                    if (lesson.position > lesson.peoples)
                        lesson.mode = -6;
                    else
                        lesson.mode = -5;
                }
            } else {
                lesson.mode = 9
            }
            lesson.subhead = `${secondsToDuration(lesson.start_time)}-${secondsToDuration(lesson.end_time)}`
        }
        return x;
    })
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
function getShortDateString(seconds) {
    const t = new Date(seconds * 1000);
    return `${t.getMonth() + 1}月${t.getDate()}日周${'日一二三四五六'[t.getDay()]}`;
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
function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
        }, {})
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
function secondsToDuration(seconds) {
    return `${(seconds / 3600) | 0}:${(seconds % 3600 / 60).toString().padStart(2, '0')}`
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
function transform(input) {
    Object.values(input)[0]
        .map((_, i) => Object.keys(input)
            .reduce((prev, curr) => {
                prev[curr] = input[curr][i]
                return prev
            }, {}))
}

/*

*/

module.exports = {
    applyBasicSettings,
    execute,
    fetch,
    fetchAsync,
    fetchData,
    fetchToken,
    formatLessons,
    fuzzysearch,
    getAsync,
    getRandomColor,
    getRandomInt,
    getShortDateString,
    getStringAsync,
    getUserInfo,
    groupBy,
    groupByKey,
    loadData,
    parseDate,
    parseTime,
    patchAsync,
    post,
    request,
    secondsToDuration,
    send,
    signIn,
    transform
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