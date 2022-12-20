const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app
  },
  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
    this.data.id = options.id || 2;
    this.loadData();
  },
  navigate(e) {
    utils.navigate(e)
  },
  async loadData() {
    utils.getString(app, `v1/teacher?id=${this.data.id}`, (err, data) => {
      if (err) return;
      this.setData({
        teacher: data
      });
    });
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onShow() {
    this.setData({
      background: utils.getRandomColor()
    })
  }
})
