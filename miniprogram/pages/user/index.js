const shared = require('../../shared');
const app = getApp();

Page({
    data: {
        app
    },

    async onShow() {
        this.setData({
            backgroundColor: shared.getRandomColor(),
        });
    },

    onSuccess(res) {
        app.globalData.userInfo = res.detail;
        this.setData({
            showLogin: false,
            user: res.detail
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
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/user/index')}`
        })
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
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
        await this.loadData();
    },
    async loadData() {
        const obj = await fetchUser(app);
        this.setData({
            user: obj
        })
    },
    onPrivateTeacherCourse(e) {
        wx.navigateTo({
            url: "/pages/coaches/index"
        })
    },
    onGroupCourses(e) {
        wx.switchTab({
            url: '/pages/appointment/index'
        })
    },
    navigateTo(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.src
        })
    },

    onShowFeedback(e) {
        this.setData({
            feedbackActive: true
        });
    },
    onShowHistory() {
        wx.navigateTo({
            url: '/pages/lessons/lessons'
        })
    },
    onShowVipList() {
        wx.navigateTo({
            url: '/pages/userVipList/userVipList'
        })
    },
    onMemberPhysicalExamination(e) {
        wx.navigateTo({
            url: `/pages/physicalExamination/physicalExamination`
        });
    }

})

function fetchUser(app) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/user.query?id=${app.globalData.userInfo.id}`,
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
