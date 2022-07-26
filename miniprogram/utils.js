// 谷歌 Material 500 的颜色
// Those values are the relative lightness/darkness or "tint" of the color, where 50 is lightest and 900 is darkest. The Material Design guidelines suggest using the 500 tint as your primary color and the 700 tint as the darker status bar color.

const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];
const SECONDS_IN_TIME = [
    1, // 1 second
    60, // 1 minute
    3600, // 1 hour
    86400, // 1 day
    604800, // 1 week
    2419200, // 1 month
    29030400 // 1 year
];
const en_US = [
    "刚刚", "秒之前",
    "1 分钟之前", "分钟之前",
    "1 小时之前", "小时之前",
    "1 天之前", "天之前",
    "1 周之前", "周之前",
    "1 月之前", "月之前",
    "1 年之前", "年之前"
]

// 计算微信顶部导航栏的尺寸，用于自定义导航栏
function calculateNavigationBarSize() {
    const {
        screenWidth,
        statusBarHeight
    } = wx.getSystemInfoSync();
    // 胶囊按钮
    const {
        height,
        top,
        right
    } = wx.getMenuButtonBoundingClientRect();
    // 左边内边距
    const paddingLeft = screenWidth - right;
    const navigationHeight = (top - statusBarHeight) * 2 + height;
    return {
        navigationHeight,
        navigationTop: statusBarHeight,
        paddingLeft,
    }
}

// 测试微信用户头像是否已失效
// 应当紧测试微信提供的头像，如果头像保存在服务器，应该跳过以降低负载

function checkIfAvatar(app, url) {

    return new Promise((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/avatar`,
            data: {
                q: url
            },
            method: 'GET',
            success: res => {
                // if (res.header['X-ErrNo'] === '-6101') {
                //     reject()
                // }
                if (res.statusCode > 400 || res.statusCode < 200) {
                    reject();
                } else
                    resolve()
            },
            fail: error => {
                reject(error)
            }
        })
    });

}

function chooseImage() {
    return new Promise((resolve, reject) => {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                resolve(res.tempFilePaths[0]);
            },
            fail: err => {
                reject(err);
            }
        });
    });
}
// 通过比较微信基础库版本号，用于解决兼容性问题
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }

    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])

        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }

    return 0
}
function debug(app, openid) {
    const { brand,
        model,
        pixelRatio,
        screenHeight,
        screenWidth,
        version,
        SDKVersion,
        platform } = wx.getSystemInfoSync();
    const data = {
        brand,
        model,
        pixel_ratio: pixelRatio,
        screen_height: screenHeight,
        screen_width: screenWidth,
        version,
        sdk_version: SDKVersion,
        platform,
        open_id: openid
    };
    postString(app, "v1/debug", data)
}

// 格式化以毫秒为单位的时间戳
function formatBeijingTime(t) {
    const n = new Date(t);
    return `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`
}
// 格式腾讯天气接口返回的数据
function formatWeather(obj) {
    return obj['weather'] + obj['degree'] + '°' + { "0": "微风", "1": "东北风", "2": "东风", "3": "东南风", "4": "南风", "5": "西南风", "6": "西风", "7": "西北风", "8": "北风", "9": "旋转风" }[obj['wind_direction']] + obj['wind_power'] + "级"
    // obj['weather'] + obj['degree'] + '° • ' + { "0": "微风", "1": "东北风", "2": "东风", "3": "东南风", "4": "南风", "5": "西南风", "6": "西风", "7": "西北风", "8": "北风", "9": "旋转风" }[obj['wind_direction']] + obj['wind_power'] + "级" + " • 湿度" + obj['humidity'] + "%"
}
// 通过淘宝接口获取北京时间
function getNetworkTime(callback) {
    wx.request({
        url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
        success: res => {
            if (res.statusCode === 200) {
                callback(parseInt(res.data.data.t))
            }
        }
    });
}
// 鉴权后获取用户OpenId
function getOpenId(host) {
    return new Promise((resolve, reject) => {
        wx.login({
            success: async response => {
                try {
                    const res = await request(`${host}/v1/authorization?code=${response.code}`)
                    resolve(res.data.openid);
                } catch (error) {
                    reject(error)
                }
            },
            fail: error => {
                reject(error)
            }
        });
    });
}
// 获取随机颜色
function getRandomColor() {
    return colors[getRandomInt(0, colors.length)];
}
// 获取一定范围内的颜色
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
// 异步非等待请求远程数据，应尽量使用此函数，以提高程序整体流畅度
function getString(app, path, callback, arg) {
    wx.request({
        url: `${app.globalData.host}/${path}${path.indexOf('?') === -1 ? '?' : '&'}openId=${app.globalData.openid}`,
        ...arg,
        success: response => {
            if (response.statusCode === 404) {
                callback(new Error())
                return
            }
            callback(null, response.data)
        },
        fail: error => {
            callback(error)
        }
    });
}

function getStringAsync(app, path, arg) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/${path}${path.indexOf('?') === -1 ? '?' : '&'}openId=${app.globalData.openid}`,
            ...arg,
            success: response => {
                resolve(response.data)
            },
            fail: error => {
                reject(error)
            }
        });
    });
}

// 异步获取用户昵称头像等信息
// 特定版本的基础库已关闭该接口。调用后将统一返回一致的头像和名为微信用户的昵称
// 使用该方法时必须考虑兼容性
function getUserProfile() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用于完善会员资料',
            success: response => {
                resolve(response)
            },
            fail: error => {
                reject(error)
            }
        });
    })
}
function getWeather(callback) {
    wx.request({
        url: "https://wis.qq.com/weather/common?source=xw&refer=h5&weather_type=observe&province=%E6%B9%96%E5%8D%97%E7%9C%81&city=%E9%95%BF%E6%B2%99%E5%B8%82",
        success: res => {
            if (res.statusCode === 200) {
                callback(res.data.data.observe)
            }
        }
    });
}

function isUserInfoProtected() {
    return compareVersion(wx.getSystemInfoSync().SDKVersion, "2.27.1") >= 0
}
function navigate(e) {
    if (e.currentTarget.dataset.tab) {
        wx.switchTab({
            url: e.currentTarget.dataset.tab,
        })
    } else if (e.currentTarget.dataset.href) {
        wx.navigateTo({
            url: e.currentTarget.dataset.href + (e.currentTarget.dataset.id || ''),
        })
    }
}
function postString(app, path, data, callback, arg) {
    wx.request({
        url: `${app.globalData.host}/${path}${path.indexOf('?') === -1 ? '?' : '&'}openId=${app.globalData.openid}`,
        method: 'POST',
        data,
        ...arg,
        success: response => {
            callback && callback(null, response.data)
        },
        fail: error => {
           callback &&  callback(error)
        }
    });
}
// 异步化函数
function promisify(api) {
    return (opt, ...arg) => {
        return new Promise((resolve, reject) => {
            api(Object.assign({}, opt, {
                success: resolve,
                fail: reject
            }), ...arg)
        })
    }
}
// 异步Http请求函数
function request(url, arg) {
    /*
    https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
  const res = await utils.request(
          `${app.globalData.host}/v/user`, {
          method: 'POST',
          data: {
            avatarUrl, nickName, openid
          }
        });
    */
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            ...arg,
            success: response => {
                resolve(response)
            },
            fail: error => {
                reject(error)
            }
        });
    })
}
// 简化显示真机调试信息
async function showMessageModal(content) {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '询问',
            content,
            success(res) {
                if (res.confirm) {
                    resolve()
                } else {
                    reject();
                }
            }
        })
    });
}
function showModal(title, content, success) {
    wx.showModal({
        title,
        content,
        success: res => {
            if (res.confirm) {
                success()
            }
        }
    })
}
function substringAfterLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(index + delimiter.length);
    }
}// https://github.com/tekinosman/timeago-js/blob/main/timeago.js
function timeago(timestamp, lang) {

    let now = Math.floor(new Date / 1000);
    let diff = (now - timestamp) || 1; // prevent undefined val when diff == 0

    for (let i = 6; i >= 0; i--) {

        if (diff >= SECONDS_IN_TIME[i]) {

            let time_elapsed = Math.floor(diff / SECONDS_IN_TIME[i]);
            let adverbs = en_US;
            let sentence = adverbs.map((el, idx) => idx % 2 == 0 ? el : time_elapsed + " " + el);

            return time_elapsed >= 2 ? sentence[i * 2 + 1] : sentence[i * 2];

        }

    }

}
function uploadFile(url, filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url,
            filePath,
            name: 'images',
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err);
            }
        });
    });
}
function formatDate(ms) {
    const t = new Date(ms);
    return `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${(t.getDate()).toString().padStart(2, '0')} ${(t.getHours()).toString().padStart(2, '0')}:${(t.getMinutes()).toString().padStart(2, '0')}:${(t.getSeconds()).toString().padStart(2, '0')}`;
}
module.exports = {
    calculateNavigationBarSize,
    checkIfAvatar,
    chooseImage,
    compareVersion,
    debug,
    formatBeijingTime,
    formatWeather,
    getNetworkTime,
    getOpenId,
    getRandomColor,
    getString,
    getStringAsync,
    getUserProfile,
    getWeather,
    isUserInfoProtected,
    navigate,
    postString,
    request,
    showMessageModal,
    showModal,
    substringAfterLast,
    timeago,
    uploadFile,
    formatDate
}
// const utils = require('../../utils');