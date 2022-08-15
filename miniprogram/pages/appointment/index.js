const app = getApp();
const shared = require('../../shared')

Page({
    async onTabSubmit(evt) {
        let offset;
        let startTime = new Date();
        if (startTime.getDay() === 0)
            offset = 6 - evt.detail;
        else
            offset = startTime.getDay() - evt.detail - 1;
        startTime.setDate(startTime.getDate() - offset)
        const lessons = await fetchLessons(app, startTime.setHours(0, 0, 0, 0) / 1000);
        this.setData({
            lessons: formatLessons(lessons)
        })
    },
    onSelectedIndexChanged(e) {
        if (e.detail === 1) {
            const dates = getDates(this, 7);
            this.setData({
                dates,
                selectedDateTime: dates[0].time * 1000,
                selected: 0
            });
            this.loadData();
        } else {
            const dates = getDates(this);
            this.setData({
                dates,
                selectedDateTime: dates[this.data.todayIndex].time * 1000,
                selected: this.data.todayIndex
            });
            this.loadData();
        }
    },
    data: {
        active: false,
        selectedDateTime: 0,
        app,
    },
    async onLoad(options) {
        if (!app.globalData.configs) {
            app.globalData.ready = () => {
                this.setData({
                    app
                })
                this.initialize();
            }
            return
        }
        await this.initialize();
        shared.applyBasicSettings();

    },
    async initialize() {
        const now = new Date();
        this.setData({
            tabSelected: now.getDay() === 0 ? 6 : now.getDay() - 1
        });
        await fetchToken(app);
        const lessons = await fetchLessons(app, new Date().setHours(0, 0, 0, 0) / 1000);
        console.log(lessons)
        this.setData({
            lessons: formatLessons(lessons)
        })
    },

    onShareAppMessage() {
        return {
            title: '晨蕴瑜伽日课表'
        }
    },
    onSuccess(res) {
        app.globalData.userInfo = res.detail;
        this.setData({
            showLogin: false,
            user: res.detail
        })
    },

    onHeadTap(e) {
        console.log(e.detail)
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/lesson/lesson?id=${id}`
        })
    }
})


function getDates(page, offset = 0) {
    const dates = [];
    const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayDateTimestamp = today.getTime();
    let start = calculateStartTimestamp(todayDateTimestamp, today.getDay());
    for (let index = 0; index < 7; index++) {
        const timestamp = new Date((start + 86400 * (index + offset)) * 1000);
        if (todayDateTimestamp === timestamp.getTime()) {
            page.setData({
                selected: index,
                todayIndex: index,
                selectedDateTime: timestamp.getTime()
            });
        }
        dates.push({
            id: index,
            week: todayDateTimestamp === timestamp.getTime() ? '今日' : weeks[timestamp.getDay()],
            day: timestamp.getDate(),
            month: timestamp.getMonth(),
            time: timestamp / 1000
        })
    }
    return dates;
}

function calculateStartTimestamp(dateTimestamp, day) {

    if (day === 0) {
        return dateTimestamp / 1000 - 86400 * 6;
    } else {
        return dateTimestamp / 1000 - 86400 * (day - 1);
    }
}

//

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

function loadData(page, url, key, action) {
    fetchData(url, (data) => {
        page.setData({
            [key]: action ? action(data) : data
        })
    })
}

function loadDataSecret(page, url, key, action, actionToken) {
    fetchDataSecret(url, page.data.token, (data, token) => {
        if (actionToken) {
            actionToken(token)
        }
        page.setData({
            [key]: action ? action(data) : data
        })
    })
}

function fetchDataSecret(url, token, action) {
    wx.request({
        url,
        header: {
            token
        },
        success: res => {
            action(res.data, res.header.Token)
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

function fetchLessons(app, startTime) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/reservation.query.today?userId=${app.globalData.userInfo.id}&startTime=${startTime}&classType=4`,
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

function formatLessons(lessons) {
    if (!lessons || !lessons.length) return [];
    const lessonGroups = shared.groupByKey(lessons, 'date_time');
    const seconds = new Date().setHours(0, 0, 0, 0) / 1000;
    const times = Math.floor(new Date().setSeconds(0, 0) / 1000) - seconds;
    return Object.entries(lessonGroups).map(x => {
        x[0] = shared.getShortDateString(x[0])
        x[1] = x[1].sort((x, y) => {
            return x.start_time - y.start_time
        })
        for (const lesson of x[1]) {
            if (lesson.course_id === 429) {
                //lesson.reservation_id = 1;
                lesson.position = 1;
                lesson.peoples = 0;
                lesson.start_time = 16 * 3600;
                lesson.end_time = 17 * 3600;
            }
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
            lesson.subhead = `${shared.secondsToDuration(lesson.start_time)}-${shared.secondsToDuration(lesson.end_time)}`
        }
        return x;
    })
}