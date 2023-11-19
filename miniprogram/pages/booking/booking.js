const utils = require('../../utils')
const app = getApp();

import init, {
  bind_booking,
  book,
  unbook,
  user_query
} from "../../pkg/weixin";

Page({
  data: {
    app,
    // 距离今天的天数，用于切换本周下周
    offset: 0,
    // 用户选定单位为秒钟的时间
    selectedTime: 0,
    isPreviewing: false
  },
  async onLoad() {
    await init();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
    // 仅包含日期不包含小时等的单位为秒钟的今天的时间
    this.data.selectedTime = new Date().setHours(0, 0, 0, 0) / 1000;
    // 设置底部栏
    this.getTabBar().setData({
      items: [{
        name: "首页",
        src: "home",
        href: "index"
      }, {
        name: "团课",
        src: "big",
        href: "booking"
      }, {
        name: "小班",
        src: "small",
        href: "small"
      }, {
        name: "私教",
        src: "one",
        href: "one",
        page: true
      }],
      selected: 1
    })
    this.loadData()
  },
  navigate(e) {
    utils.navigate(e)
  },
  async loadData() {
    let openid = (await app.getOpenId()) || "";
    this.setData({
      holiday: false,
      loading: true
    })
    try {
      await bind_booking(app.globalData.host, this.data.selectedTime,
        openid, 4, this);
    } catch (error) {
      this.setData({
        holiday: true,
        loading: false,
        lessons: []
      });
    }
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onBookingBarSubmit(evt) {
    if (evt.detail === "1") {
      this.setData({
        offset: 0
      });

    } else {
      this.setData({
        offset: 7
      });
    }
  },
  onDailyScheduleSubmit(evt) {
    this.data.selectedTime = evt.detail
    this.loadData()
  },
  async onBookingItemSubmit(evt) {
    const item = evt.detail;
    if (item.mode & 6) {
      await this.unbook(item)
    } else if (((item.mode & 8) || (item.mode & 128))) {
      await this.book(item)
    }
  },
  onClick(e) {
    const { id, bookid, mode } = e.currentTarget.dataset;
    if (mode === 32) {
      this.book(id)
    } else if (mode === 64) {
      this.unbook(bookid)
    }
  },
  // 预约课程
  async book(id) {
    let result = await checkUserAvailability(app);
    if (!result) {
      wx.navigateTo({
        url: `/pages/login/login?return_url=${encodeURIComponent(`/pages/booking/booking`)}`
      })
      return;
    }
    try {
      let openid = (await app.getOpenId()) || "";
      result = await book(app.globalData.host, id, openid);
      if (result > 0) {
        await this.loadData();
      }
      else {
        wx.showModal({
          title: '信息',
          content: '请您购买会员卡',
          success: res => {
            if (res.confirm) {

            }
          }
        })
      }
    } catch (error) {

    }
  },
  // 取消已预约的课程
  async unbook(bookid) {
    try {
      await unbook(app.globalData.host, bookid, app.globalData.openid);
      await this.loadData();
    } catch (error) {
      console.log(error)
    }
  },
  onPreview(e) {
    this.setData({
      previewText:e.target.dataset.name,
      previewImage:e.target.dataset.image,
      isPreviewing:true
    })
  },
  onClosePreview(){
    this.setData({
      isPreviewing:false
    })
  }
}

)
async function checkUserAvailability(app) {
  if (!app.globalData.openid) {
    return false;
  }
  if (app.globalData.userId) {
    return true;
  }
  let result;
  try {
    result = await user_query(app.globalData.host, app.globalData.openid);
    //TODO: check
    if (!result || !result.nick_name) {
      return false;
    }
    app.globalData.userId = result;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}