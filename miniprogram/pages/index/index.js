const app = getApp();
const shared = require("../../utils/shared");

import init, {
  beijing_time,
  lunar_time,
  get_weather,
  bind_index
} from "../../pkg/weixin";


Page({
  data: {
    app,
    enabled: false
  },
  // 该页面加载时运行一次的方法
  async onLoad() {
    await init();
    initializeTopBar(this);
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
    await bind_index(this, app.globalData.host);
  },
  navigate(e) {
    shared.navigate(e);
  },
  // 设置分享时的标题
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onHomeActionsSubmit(evt) {
      
    if (evt.detail === 2) {
      wx.switchTab({
        url: `/pages/booking/booking`
      })
    } else if (evt.detail === 3) {
      wx.navigateTo({
        url: `/pages/one/one`
      })
    }else if (evt.detail === 5) {
      wx.navigateTo({
        url: `/pages/sudoku/sudoku`
      })
    }else if (evt.detail === 6) {
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

// 格式化以毫秒为单位的时间戳
function formatBeijingTime(t) {
  const n = new Date(t);
  return `北京时间 ${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`
}

async function initializeTopBar(page) {
  const { navigationHeight, navigationTop, paddingLeft } = shared.getNavigationBarSize();
  page.setData({
    navigationHeight,
    navigationTop,
    navigationPaddingLeft: paddingLeft,
    navigationTitleFontSize: navigationHeight / 6 * 2,
    navigationSubTitleFontSize: navigationHeight / 6 * 1.5,
    navigationGap: navigationHeight / 6 * .3
  })

  page.setData({
    weather: await get_weather(),
    date: lunar_time(),
  });
  page.data.time = parseInt(await beijing_time());
  clearInterval(page.data.timer);
  page.setData({
    bj: formatBeijingTime(page.data.time)
  });
  page.data.timer = setInterval(() => {
    page.data.time += 1000;
    page.setData({
      bj: formatBeijingTime(page.data.time)
    });
  }, 1000);
}