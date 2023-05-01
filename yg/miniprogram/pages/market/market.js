const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
    this.loadData();
  },
  navigate(e) {
    utils.navigate(e)
  },
  async loadData() {
    utils.getString(app, "v1/market", (err, data) => {
      if (err) return;

      this.setData({
        market: data,
        timeago: utils.timeago(data.updated_time)
      });
    });
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
})