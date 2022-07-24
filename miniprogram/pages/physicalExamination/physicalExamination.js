

const shared = require('../../shared');
const app = getApp();
Page({
  data: {
    app,
    loading: false
  },
  onHide() {
    if (this.data.worker) {
      this.data.worker.terminate();
    }
  },
  onUnload() {
    if (this.data.worker) {
      this.data.worker.terminate();
    }
  },
  async onShow() {
    this.data.worker = wx.createWorker('workers/physicalExamination.js');
    this.data.worker.onMessage((res) => {
      if (res.action === 1) {
        const obj = res.data;
        const date = new Date(obj.creationTime / 10000);
        obj.creation = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日${date.getHours()}时${date.getMinutes()}分${date.getSeconds()}秒`;
        this.setData({
          obj
        });
      }
    });
    this.data.worker.postMessage({
      url: `${app.globalData.host}/api/card?openId=${app.globalData.openid}&mode=1`,
      action: 1
    })
  },
  onSuccess(res) {
    app.globalData.userInfo = res.detail;
    this.setData({
      showLogin: false,
      user: res.detail
    })
  },
  async onLoad(options) {
    this.data.id = options.id || 2;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  onShareAppMessage() {
    return {
      title: ''
    }
  },
})
                