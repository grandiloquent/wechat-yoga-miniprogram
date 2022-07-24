const app = getApp()
const request = require('../../request');
Page({
  data: {},
  onLoad(options) {
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
    const tag = options.tag || '';
    if (tag) {
      wx.setNavigationBarTitle({
        title: tag
      })
    }
    request.encyclopedias(app.globalData.host, tag, res => {
      this.setData({
        encyclopedias: res
      })
    });
  },
  navigate(e) {
    const src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: `/pages/encyclopedias/encyclopedias?tag=${src}`
    })
  },
  navigateToEncyclopedia(e) {
    wx.navigateTo({
      url: `/pages/encyclopedia/index?id=${e.currentTarget.dataset.id}`
    })
  },
  onShareAppMessage() {
    return {
      title: '瑜伽百科'
    }
  },
})