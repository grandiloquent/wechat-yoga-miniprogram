
const app = getApp()
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
      url:`${app.globalData.host}/api/notice?mode=2&id=${options.id}`,
      
      success: res => {
        this.setData({
            announcement: res.data
          })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: '公告'
    }
  },
  handleNavigate() {
    wx.switchTab({
      url: '/pages/appointment/index'
    })
  }
})