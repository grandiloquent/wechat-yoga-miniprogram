const app = getApp();
const shared = require('../../shared')

Page({
    data: {
        active: false,
        selectedDateTime: 0,
        offsetDays: 0,
        app,
    },
    // 开始加载数据和渲染页面
    async initialize() {
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/appointment/index')}`
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
        let res;
        try {
            res = await fetch(app)
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
            title: '晨蕴瑜伽日课表'
        }
    },
})

function fetch(app) {
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/?userId=${app.globalData.userInfo.id}`,
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


