const app = getApp();
const shared = require('../../shared')

Page({
    data: {
        active: false,
        startTime: new Date().setHours(0, 0, 0, 0) / 1000,
        endTime: new Date().setHours(0, 0, 0, 0) / 1000 + 3600 * 24,
        app,
    },
    // 开始加载数据和渲染页面
    async initialize() {
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/checkIn/checkIn')}`
        })
        try {
            await shared.fetchToken(app);
        } catch (e) {
            this.setData({
                showLogin: true
            });
            return
        }
        this.loadData();
    },
    async loadData() {
        let lessons;
        try {
            lessons = await fetch(app, this.data.startTime, this.data.endTime)
            this.setData({
                lessons: shared.formatLessons(lessons)
            })
        } catch (e) {
            console.error(e)
        }
    },
    // 加载程序配置、应用基础页面配置、启动数据渲染
    async onLoad(options) {
        shared.applyBasicSettings();
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
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
    },
    onShareAppMessage() {
        return {
            title: '已约课程'
        }
    },
    async onUnBook(evt) {
        const id = evt.currentTarget.dataset.reservedid;
        wx.showModal({
            title: '您确定要取消预约吗？',
            success: async res => {
                if (res.confirm) {
                    await shared.unBook(app, id, async () => {
                        await this.loadData()
                    });
                }
            }
        })
    },
    async onUnWait(evt) {
        await this.onUnBook(evt)
    },
    async onActionsSubmit(evt) {
        if (evt.detail === 0) {
            this.data.startTime = new Date().setHours(0, 0, 0, 0) / 1000;
            this.data.endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 3600 * 24;
            await this.loadData()
        } else if (evt.detail === 1) {
            this.data.startTime = new Date().setHours(0, 0, 0, 0) / 1000 + 3600 * 24;
            this.data.endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 2 * 3600 * 24;
            await this.loadData()
        } else if (evt.detail === 2) {
            this.data.startTime = new Date().setHours(0, 0, 0, 0) / 1000;
            this.data.endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 7 * 3600 * 24;
            await this.loadData()
        }
    },
    onEmptyViewerSubmit() {
        wx.switchTab({
            url: `/pages/appointment/index`
        })
    }
})

function fetch(app, startTime, endTime) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/reservation.query.user?startTime=${startTime}&endTime=${endTime}&classType=4&userId=${app.globalData.userInfo.id}`,
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


