const app = getApp();
const shared = require('../../shared')

Page({
    data: {
        active: false,
        selectedDateTime: 0,
        offsetDays: 0,
        app,
    },
    async initialize() {
        try {
            await shared.fetchToken(app);
        } catch (e) {
            this.setData({
                showLogin: true
            });
            return
        }
        await this.today();
    },
    async loadLessons() {
        const lessons = await fetchLessons(app, this.data.selectedDateTime);
        this.setData({
            lessons: shared.formatLessons(lessons)
        })
    },
    async onBook(evt) {
        const id = evt.currentTarget.dataset.id;
        await shared.book(app, id, async () => {
            await this.loadLessons();
        })
    },
    onHeadTap(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/lesson/lesson?id=${id}`
        })
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
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/appointment/index')}`
        })
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
    },
    async onSelectedIndexChanged(e) {
        if (e.detail === 1) {
            this.data.offsetDays = 7;
            this.setData({
                tabSelected: 0
            });
            let offset;
            let startTime = new Date();
            if (startTime.getDay() === 0)
                offset = 6;
            else
                offset = startTime.getDay() - 1;
            startTime.setDate(startTime.getDate() - offset + this.data.offsetDays)
            this.data.selectedDateTime = startTime.setHours(0, 0, 0, 0) / 1000
            await this.loadLessons();
        } else {
            this.data.offsetDays = 0;
            await this.today();
        }
    },
    onShareAppMessage() {
        return {
            title: '晨蕴瑜伽日课表'
        }
    },
    async onTabSubmit(evt) {
        let offset;
        let startTime = new Date();
        if (startTime.getDay() === 0)
            offset = 6 - evt.detail;
        else
            offset = startTime.getDay() - evt.detail - 1;
        startTime.setDate(startTime.getDate() - offset + this.data.offsetDays)
        this.data.selectedDateTime = startTime.setHours(0, 0, 0, 0) / 1000
        await this.loadLessons();
    },
    async onUnBook(evt) {
        const id = evt.currentTarget.dataset.reservedid;
        await shared.unBook(app, id, async () => {
            await this.loadLessons();
        });
    },
    async onUnWait(evt) {
        await this.onUnBook(evt)
    },
    async today() {
        const now = new Date();
        this.setData({
            tabSelected: now.getDay() === 0 ? 6 : now.getDay() - 1
        });
        this.data.selectedDateTime = now.setHours(0, 0, 0, 0) / 1000;
        await this.loadLessons();
    }

})

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


