const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app,
    showLogin: false
  },
  onShow() {
    this.setData({
      backgroundColor: utils.getRandomColor()
    })
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
  loadData() {
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
  }, onUserProfileSubmit(evt) {
    if (evt.detail === '0') {
      this.setData({
        showLogin: true
      });
    }
  }, onLoginSubmit(evt) {
    this.setData({
      showLogin: false
    });
    this.loadData();
  }
})

function onUserActionsSubmit(evt){

}