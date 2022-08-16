const app = getApp()
const calendar = require('../../calendar');
const shared = require('../../shared')

Page({
    data: {
        app
    },
    handleNavigateToBook() {
        wx.switchTab({
            url: '/pages/appointment/index',
        })
    },
    navigateToAnnouncement(e) {
        wx.navigateTo({
            url: `/pages/announcement/index?id=${e.currentTarget.dataset.id}`,
        });
    },
    navigateToBookClass() {
        wx.switchTab({
            url: '/pages/appointment/index',
        })
    },
    navigateToCoach(e) {
        wx.navigateTo({
            url: `/pages/coach/index?id=${e.currentTarget.dataset.id}`,
        })
    },
    navigateToDiscount() {
        wx.navigateTo({
            url: "/pages/discount/index",
        })
    },
    onLoad() {
        if (!app.globalData.configs) {
            app.globalData.ready = () => {
                this.setData({
                    app
                })
            }
        }
        shared.applyBasicSettings();
        const t = new Date();
        this.setData({
            date: calendar.solar2lunar(t.getFullYear(), t.getMonth() + 1, t.getDate())
        });
        wx.request({
            url: `${app.globalData.host}/api/teachers.query`,
            success: res => {
                this.setData({
                    coaches: res.data
                })
            }
        });
        wx.request({
            url: `${app.globalData.host}/api/reservation.query.market`,
            success: res => {
                this.setData({
                    prompts: res.data
                })
            }
        });
        wx.request({
            url: `${app.globalData.host}/api/notices.query`,
            success: res => {
                this.setData({
                    announcements: res.data.map(x => {
                        x.update = formatDateTime(x.updated_time);
                        return x;
                    })
                })
            }
        });
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/index/index')}`
        })
    },
    onShareAppMessage() {
        return {
            title: '瑜伽约课工具'
        };
    },
    onShow() {
        fetchWeatherInfo((data) => {
            this.setData({
                weather: data
            })
        })
        wx.request({
            url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
            success: res => {
                if (res.statusCode === 200) {
                    this.data.time = parseInt(res.data.data.t);
                    clearInterval(this.data.timer);
                    const n = new Date(this.data.time);
                    this.setData({
                        bj: `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`
                    });
                    this.data.timer = setInterval(() => {
                        this.data.time += 1000;
                        const n = new Date(this.data.time);
                        this.setData({
                            bj: `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`
                        });
                    }, 1000);
                }
            }
        });
    },
});


function fetchWeatherInfo(action) {
    wx.request({
        url: "https://wis.qq.com/weather/common?source=xw&refer=h5&weather_type=observe&province=%E6%B9%96%E5%8D%97%E7%9C%81&city=%E9%95%BF%E6%B2%99%E5%B8%82",
        success: res => {
            if (res.statusCode === 200) {
                action(formatWeatherInfo(res.data.data.observe))
            }
        }
    });
}

function formatWeatherInfo(obj) {
    const windDirections = {
        "0": "微风", "1": "东北风", "2": "东风", "3": "东南风", "4": "南风", "5": "西南风",
        "6": "西风", "7": "西北风", "8": "北风", "9": "旋转风"
    }
    return `${obj['weather']}${obj['degree']}°${windDirections [obj['wind_direction']]}${obj['wind_power']}级`;
    // obj['weather'] + obj['degree'] + '° • ' + {
    //     "0": "微风", "1": "东北风", "2": "东风", "3": "东南风", "4": "南风", "5": "西南风",
    //     "6": "西风", "7": "西北风", "8": "北风", "9": "旋转风"
    // }[obj['wind_direction']] + obj['wind_power'] + "级" + " • 湿度" +
    // obj['humidity'] + "%"
}

function formatDateTime(seconds) {
    const date = new Date(seconds * 1000);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return date.getFullYear() + "-" + (month >= 10 ? month : '0' + month) + "-" + (day >= 10 ? day : '0' + day);
}