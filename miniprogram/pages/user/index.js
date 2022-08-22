const shared = require('../../shared');
const app = getApp();
Page({
    data: {
        app
    },
    async initialize() {
        shared.accessRecords(app, '/pages/user/index');
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
    async onChangAvatar() {
        try {
            const res = await chooseImage();
            const tempFilePath = res.tempFiles[0].tempFilePath;
            const imageName = await uploadFile(app, tempFilePath);
            await insertUser(app, {
                avatar_url: `${app.globalData.staticHost}/images/${imageName}`,
                open_id: app.globalData.openid
            });
            await this.loadData();
        } catch (error) {
        }
    },
    onGroupCourses(e) {
        wx.switchTab({
            url: '/pages/appointment/index'
        })
    },
    async onLoad(options) {
        shared.applyBasicSettings();
        if (!app.globalData.configs) {
            shared.loadSettings(app.globalData.host, async (data) => {
                app.globalData.configs = data;
                this.setData({
                    app
                })
                await this.initialize();
            })
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
async function chooseImage() {
    return new Promise((reslove, reject) => {
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            camera: 'back',
            success: function (res) {
                reslove(res);
            },
            fail: function () {
                reject();
            }
        })
    })
}
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
async function insertUser(app, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/user`,
            method: 'POST',
            data,
            success: res => {
                resolve(res)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}
async function uploadFile(app, tempFilePath) {
    return new Promise((reslove, reject) => {
        wx.uploadFile({
            url: `${app.globalData.host}/api/article/2`,
            filePath: tempFilePath,
            name: "images",
            success: function (res) {
                reslove(res.data)
            },
            fail: function () {
                reject();
            }
        })
    })
}
