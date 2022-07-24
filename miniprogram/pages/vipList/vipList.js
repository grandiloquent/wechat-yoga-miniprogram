// pages/vipList.js
const shared = require('../../shared');
const app = getApp();

Page({
  data: {
    app
  },
  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    shared.fetch(this, "card/2", [], "cards");
  },
  onShareAppMessage() {
    return {
      title: '会员卡'
    }
  }

})