const app = getApp();

Page({
  data: {
    app
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    wx.request({
      url: `${app.globalData.host}/api/coach?mode=2`,
      success: res => {
        if (res.statusCode === 200) {
          this.setData({
            coaches: res.data
          })
        } else if (res.statusCode === 204) {

        } else {
          wx.showToast({
            title: "网络不稳定",
            icon: "error"
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: "网络不稳定",
          icon: "error"
        });
      }
    });

  },
  onShareAppMessage() {
    return {
      title: '约私教'
    }
  },
  navigateToCoach(e) {
    wx.navigateTo({
      url: `/pages/coach/index?id=${e.currentTarget.dataset.id}`
    })
  }
})