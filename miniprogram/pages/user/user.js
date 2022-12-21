const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app,
    showLogin: false
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
  },
  navigate(e) {
    utils.navigate(e)
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
  onLoginSubmit(evt) {
    this.setData({
      showLogin: false
    });
    this.loadData();
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onShow() {
    this.setData({
      backgroundColor: utils.getRandomColor()
    })
  },
  onUserProfileSubmit(evt) {
    if (evt.detail === '0') {
      this.setData({
        showLogin: true
      });
    }
  }
})

function onUserActionsSubmit(evt) {

}