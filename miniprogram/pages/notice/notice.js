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
    this.data.id = options.id || 1;
    this.loadData();
  },
  navigate(e) {
    utils.navigate(e)
  },
  async loadData() {
    utils.getString(app, `yoga/notice?id=${this.data.id}`, (err, data) => {
      if (err) return;
      console.log(data);
      this.setData({
        notice: data,
timeago:utils.timeago(data.updated_time)
      });
    });
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onBreadcrumbSubmit(evt) {
    if (evt.detail === "1") {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  }
})