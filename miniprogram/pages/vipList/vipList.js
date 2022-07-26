const app = getApp();

Page({
  data: {
    app
  },
  onLoad(options) {
    if (!app.globalData.configs) {
            app.globalData.ready = () => {
                this.setData({
                    app
                })
            }
        }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    wx.request({
      url:`${app.globalData.host}/api/card?mode=1`,
      success: res => {
        this.setData({
        cards:res.data
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '会员卡'
    }
  }
})