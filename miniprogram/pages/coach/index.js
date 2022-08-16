const shared = require("../../shared");
const app = getApp();
Page({
    data: {
        app
    },
    async initialize(id) {
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
    async onLoad(options) {
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
        shared.applyBasicSettings();
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/coach/index')}`
        })
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
    onIntro() {
        wx.navigateTo({
            url: `/page/intro/intro?id=${this.data.id}`
        })
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
    },
    async onBook(evt) {
        const id = evt.currentTarget.dataset.id;
        let res;
        try {
            res = await shared.insertBook(app, id);
            if (res === -101) {
                wx.showToast({
                    title: '请购买会员卡',
                    icon: "error"
                })
                return
            }
            await this.loadData();
        } catch (e) {
            console.error(e);

        }
    },
    async onUnBook(evt) {
        const id = evt.currentTarget.dataset.reservedid;
        let res;
        try {
            res = await shared.deleteBook(app, id)
            await this.loadData();
        } catch (e) {
            console.error(e)
        }
    },
    onUnWait(evt) {
        const id = evt.currentTarget.dataset.id;
        console.log(evt);
    }
})

// /api/reservation?mode=10&id=1&userId=502&startTime=1660492800&endTime=1661097600&classType=4

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


