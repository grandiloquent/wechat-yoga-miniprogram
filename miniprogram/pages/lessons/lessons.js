const app = getApp();
const shared = require('../../shared')
Page({
    data: {
        app,
    },
    // 开始加载数据和渲染页面
    async initialize() {
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/lessons/lessons')}`
        })
        try {
            await shared.fetchToken(app);
        } catch (e) {
            this.setData({
                showLogin: true
            });
            return
        }
        // If we wait for the data to load from the server, 
        // it may affect the page loading speed 
        // and can greatly affect the user experience
        this.loadData();
    },
    async loadData() {
        let res;
        try {
            res = await fetch(app)
            this.setData({
                lessons: shared.sortLessons(res).map(x => {
                    x.subhead = shared.secondsToDateString(x.date_time);
                    x.time = `${shared.secondsToDuration(x.start_time)}-${shared.secondsToDuration(x.end_time)}`
                    return x;
                })
            })
        } catch (e) {
            console.error(e)
        }
    },
    // 加载程序配置、应用基础页面配置、启动数据渲染
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
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
    }
})
function fetch(app) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/user.query.books?id=${app.globalData.userInfo.id}`,
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
