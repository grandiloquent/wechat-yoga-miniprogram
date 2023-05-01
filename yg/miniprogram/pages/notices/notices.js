const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app,
title:'公告'
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: this.data.title
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
      title:this.data.title
    };
  },
})