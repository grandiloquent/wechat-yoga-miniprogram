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
    [["v1/slideshow/home", "poster"]]
      .forEach(x => {
        utils.getString(app, x[0], (err, data) => {
          if (err) return;
          this.setData({
            [x[1]]: data
          });
        });
      })

  }, onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
})