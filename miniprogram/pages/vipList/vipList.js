const app = getApp();
const shared = require('../../shared')

Page({
    data: {
        app
    },
    async onLoad(options) {
        shared.applyBasicSettings();
        await this.initialize();
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/vipList/vipList')}`
        })
    },

    async initialize() {
        await this.loadData();
    },
    async loadData() {
        let res;
        try {
            res = await fetch(app)
            this.setData({
                items: res
            })
        } catch (e) {
            console.error(e)
        }
    },
    onShareAppMessage() {
        return {
            title: '会员卡'
        }
    }
})

function fetch(app) {
    /*
    let res;
            try {
                res =await insertBook(app)
            } catch (e) {
                console.error(e)
            }
            */
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/admin.cards.query`,
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