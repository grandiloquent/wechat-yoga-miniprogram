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
       wx.navigateTo({
      url: `/pages/notice/notice?id=${e.currentTarget.dataset.id}`
    })
  },
  async loadData() {
    utils.getString(app, "v1/notices", (err, data) => {
      if (err) return;
      this.setData({
        notices: data.map(x => {
          x.timeago = utils.timeago(x.updated_time)
          return x;
        })
      });
    });
  }, onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
})