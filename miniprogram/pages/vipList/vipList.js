const app = getApp();
const shared = require('../../shared')

Page({
    data: {
        app
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
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/vipList/vipList')}`
        })
    },

    async initialize() {
        await this.loadData();
    },
    async loadData() {

    },
    onShareAppMessage() {
        return {
            title: '会员卡'
        }
    }
})