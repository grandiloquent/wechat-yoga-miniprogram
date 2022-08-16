const shared = require('../../shared');
const app = getApp();

Page({
    data: {
        app
    },
    async initialize() {
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/user/index')}`
        })
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
        console.log(obj);
        this.setData({
            user: obj.user,
            public: obj.books.filter(x => x.class_type === 4)[0].count
        })
    },
    navigateTo(e) {
        wx.navigateTo({
            url: e.currentTarget.dataset.src
        })
    },
    onGroupCourses(e) {
        wx.switchTab({
            url: '/pages/appointment/index'
        })
    },
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
    onMemberPhysicalExamination(e) {
        wx.navigateTo({
            url: `/pages/physicalExamination/physicalExamination`
        });
    },
    onPrivateTeacherCourse(e) {
        wx.navigateTo({
            url: "/pages/coaches/index"
        })
    },
    async onShow() {
        this.setData({
            backgroundColor: shared.getRandomColor(),
        });
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
    onSuccess(res) {
        app.globalData.userInfo = res.detail;
        this.setData({
            showLogin: false,
            user: res.detail
        })
    }
})

function fetchUser(app) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/user.query.book.info?id=${app.globalData.userInfo.id}`,
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
