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
    });
   this.getTabBar().setData({
      items: [{
        name: "首页",
        src: "home",
        href: "index"
      }, {
        name: "约课",
        src: "book",
        href: "booking"
      }, {
        name: "已约",
        src: "booked",
        href: "booked"
      }, {
        name: "我的",
        src: "user",
        href: "user"
      }

],
      selected: 0
    })
    this.loadData();
  },
  navigate(e) {
    utils.navigate(e)
  },
  async loadData() {
    [
      ["v1/slideshow/home", "poster"],
      ["v1/functions/home", "actions"],
      ["v1/teachers/home", "teachers"],
      ["v1/booked/home", "booked"],
      ["v1/market/home", "market"],
      ["v1/notices/home", "notices"]
    ]
    .forEach(x => {
      utils.getString(app, x[0], (err, data) => {
        if (err) return;
        this.setData({
          [x[1]]: data
        });
      });
    })

  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onSubmit() {},
  onHomeActionsSubmit(evt) {
    console.log(evt.detail)
  },
  onHomeNoticeSubmit(evt) {
    evt.detail
    wx.navigateTo({
      url: `/pages/notice/notice?id=${evt.detail}`
    })
  },
  onTeacherSubmit(evt) {
    wx.navigateTo({
      url: `/pages/teacher/teacher?id=${evt.detail}`
    })
  },
  onHomeBookedSubmit(evt) {
    wx.switchTab({
      url: `/pages/booking/booking`
    })
  }

})

function onCopyrightSubmit(evt) {

}