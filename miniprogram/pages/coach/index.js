const shared = require("../../shared");
const app = getApp();
Page({
    data: {
        app
    },
    async initialize(id) {
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/coach/index')}`
        })
        this.data.id = id || 1;
        try {
            await shared.fetchToken(app);
        } catch (e) {
            this.setData({
                showLogin: true
            });
            return
        }
        await this.loadData();
    },
    async loadData() {
        const now = new Date().setHours(0, 0, 0, 0) / 1000;
        const obj = await fetchData(app, this.data.id, now, now + 86400 * 7);
        this.setData({
            teacher: obj.teacher,
            lessons: shared.formatLessons(obj.lessons)
        })
    },
    async onBook(evt) {
        const id = evt.currentTarget.dataset.id;
        await shared.book(app, id, async () => {
            await this.loadData();
        })
    },
    onIntro() {
        wx.navigateTo({
            url: `/page/intro/intro?id=${this.data.id}`
        })
    },
    async onLoad(options) {
        shared.applyBasicSettings();
        if (!app.globalData.configs) {
            app.globalData.ready = () => {
                this.setData({
                    app
                })
                this.initialize(options.id);
            }
            return
        }
        await this.initialize(options.id);
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
    },
    onMakePhoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.teacher.phoneNumber
        })
    },
    onPreviewThumbnail() {
        wx.previewImage({
            urls: [`${app.globalData.staticHost}/images/${this.data.teacher.thumbnail}`],
            current: `${app.globalData.staticHost}/images/${this.data.teacher.thumbnail}`
        })
    },
    onShow() {
        this.setData({
            background: shared.getRandomColor()
        })
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
    }, onHeadTap(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/lesson/lesson?id=${id}`
        })
    },
})

function fetchData(app, id, startTime, endTime) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/reservation?id=${id}&mode=10&userId=${app.globalData.userInfo.id}&startTime=${startTime}&endTime=${endTime}&classType=4`,
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


