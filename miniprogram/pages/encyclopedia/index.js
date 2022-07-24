// pages/encyclopedia/index.js
const app = getApp()
const request = require('../../request');

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
      }
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    const id = options.id || 1;

    request.encyclopedia(app.globalData.host, id, res => {
      this.setData({
        data: res
      });
      wx.setNavigationBarTitle({
        title: res.title
      })
    });
  },

  navigate(e) {
    const src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url:`/pages/encyclopedias/encyclopedias?tag=${src}`
    })
  },
  handleNavigate() {
    wx.switchTab({
      url: '/pages/appointment/index'
    })
  },
  onShareAppMessage() {
    return {
      title: this.data.data.title
    }
  },
})