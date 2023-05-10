const app = getApp();

Page({
  data: {
    app
  },
  // 该页面加载时运行一次的方法
  async onLoad() {


    // 启用分享小程序的功能
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    // 设置顶部导航栏的标题
    wx.setNavigationBarTitle({
      title: app.globalData.title
    });
    // 设置底部工具栏
    this.getTabBar().setData({
      items: [{
        name: "首页",
        // 图标的路径
        src: "home",
        // 导航的页面
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
    });
    bindIndex(app, this);
  },
  navigate(e) {
    if (e.currentTarget.dataset.tab) {
      wx.switchTab({
        url: e.currentTarget.dataset.tab,
      })
    } else if (e.currentTarget.dataset.href) {
      wx.navigateTo({
        url: e.currentTarget.dataset.href + (e.currentTarget.dataset.id || ''),
      })
    }
  },
  // 设置分享时的标题
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onSubmit() { },
  onHomeActionsSubmit(evt) {
    if (evt.detail === 2) {
      wx.switchTab({
        url: `/pages/booking/booking`
      })
    } else if (evt.detail === 3) {
      wx.navigateTo({
        url: `/pages/one/one`
      })
    } else if (evt.detail === 6) {
      wx.navigateTo({
        url: `/pages/market/market`
      })
    } else if (evt.detail === 7) {
      wx.navigateTo({
        url: `/pages/notices/notices`
      })
    }
  },
  // 导航到公告页面
  onHomeNoticeSubmit(evt) {

    wx.navigateTo({
      url: `/pages/notice/notice?id=${evt.detail}`
    })
  },
  // 导航到老师页面
  onTeacherSubmit(evt) {
    wx.navigateTo({
      url: `/pages/teacher/teacher?id=${evt.detail}`
    })
  },
  // 导航到预约页面
  onHomeBookedSubmit(evt) {
    wx.switchTab({
      url: `/pages/booking/booking`
    })
  }

})

function bindIndex(app, page) {
  const url = `${app.globalData.host}/yoga/index`
  wx.request({
    url,
    success(res) {
      if (res.statusCode === 200) {
        console.log()
        page.setData(res.data)
      }
    }
  });
}