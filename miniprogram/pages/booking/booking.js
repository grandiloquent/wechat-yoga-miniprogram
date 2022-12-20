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
    utils.getString(app, "api/", (err, data) => {
      if (err) return;
      this.setData({
        key: data
      });
    });
  }, onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
onBookingBarSubmit(evt) {
        console.log(evt.detail)
      }
}

)
