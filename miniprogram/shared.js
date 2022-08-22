// const shared = require('../../shared');
const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];

function accessRecords(app, uri) {
    wx.request({
        url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent(uri)}`
    })
}

function applyBasicSettings() {
    wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })
}

async function book(app, id, action) {
    let res;
    try {
        res = await insertBook(app, id);
        if (res === -101) {
            wx.showToast({
                title: '请购买会员卡',
                icon: "error"
            })
            return
        }
        action()
    } catch (e) {
        console.error(e);
    }
}

function deleteBook(app, id) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/reservation.delete?id=${id}`,
            header: {
                token: app.globalData.token
            },
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err)
            }
        })
    }))
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
                if (res.statusCode === 404) {
                    reject()
                    return
                }
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
            } else if (lesson.date_time === seconds && lesson.start_time > times && lesson.start_time - times <= 3600) {
                lesson.mode = -3;
            } else if (lesson.date_time === seconds && lesson.end_time > times && lesson.end_time - times <= 3600) {
                lesson.mode = -4;
            } else if (lesson.reservation_id) {
                if (((lesson.date_time > seconds)) || (lesson.date_time === seconds) && (lesson.start_time > times && lesson.start_time - times > 3600 * 3)) {
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

function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, {[obj[key]]: (hash[obj[key]] || []).concat(obj)})
        }, {})
}

function insertBook(app, id) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/reservation.insert?userId=${app.globalData.userInfo.id}&id=${id}`,
            header: {
                token: app.globalData.token
            },
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err)
            }
        })
    }))
}

function loadData(page, url, key, action) {
    fetchData(url, (data) => {
        page.setData({
            [key]: action ? action(data) : data
        })
    })
}

function loadSettings(host, success) {
    wx.request({
        url: `${host}/api/configs`,
        success: res => {
            if (res.statusCode === 200) {
                success(res.data)
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
            });
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

function secondsToDateString(seconds) {
    const t = new Date(seconds * 1000)
    return `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`
}

function secondsToDuration(seconds) {
    return `${(seconds / 3600) | 0}:${(seconds % 3600 / 60).toString().padStart(2, '0')}`
}

function sortLessons(lessons) {
    return lessons.sort((x, y) => {
        if (x.date_time === y.date_time) {
            return y.start_time - x.start_time;
        }
        return y.date_time - x.date_time;
    })
}

async function unBook(app, id, success) {
    let res;
    try {
        res = await deleteBook(app, id)
        success();
    } catch (e) {
        console.error(e)
    }
}

module.exports = {
    accessRecords,
    applyBasicSettings,
    book,
    fetchToken,
    formatLessons,
    getRandomColor,
    getUserInfo,
    loadData,
    loadSettings,
    request,
    secondsToDateString,
    secondsToDuration,
    sortLessons,
    unBook,
}
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