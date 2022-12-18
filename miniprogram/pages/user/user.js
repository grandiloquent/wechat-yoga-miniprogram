const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app,
    showLogin: false
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
    utils.getString(app, "v1/user/user", (err, data) => {
      if (err) return;
      if (data) {
        this.setData({
          user: data
        });
      } else {
        this.setData({
          showLogin: true
        });
      }

    });
  }, onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
})
function onUserProfileSubmit(evt) {

}
function onLoginSubmit(evt) {

}