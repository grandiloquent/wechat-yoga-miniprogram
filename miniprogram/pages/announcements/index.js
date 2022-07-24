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
      url: `${app.globalData.host}/api/notice?mode=1`,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({
            announcements: res.data
          })
        }
      }
    });
  },
  onItemClick(e) {
    wx.navigateTo({
      url: `/pages/announcement/index?id=${e.currentTarget.dataset.id}`
    })
  },
  onShareAppMessage() {
    return {
      title: '公告'
    }
  },
})