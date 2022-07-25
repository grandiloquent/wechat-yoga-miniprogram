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
      //method:'POST',
      //data,
      success: res => {
        //resolve(res)
        this.setData({
        obj:res.data
        })
      },
      fail: err => {
        //reject(err)
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '会员卡'
    }
  }
})