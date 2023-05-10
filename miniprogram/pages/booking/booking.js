const utils = require('../../utils')
const app = getApp();
const weixin = require('../../utils/weixin');

Page({
  data: {
    app,
    // 距离今天的天数，用于切换本周下周
    offset: 0,
    // 用户选定单位为秒钟的时间
    selectedTime: 0
  },
  async onLoad() {
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
    // 清空已加载的课程
    // 隐藏“假日注意休息”的元素
    // 显示加载数据的元素
    // this.setData({
    //   lessons: null,
    //   holiday: false,
    //   loading: true
    // })
    // try {
    //   const data = await utils.getStringAsync(app, `v1/booking/query?start=${this.data.selectedTime}&classType=4`);
    //   if (!data.length) {
    //     throw new Error()
    //   }
    //   utils.setLessonStatus(data, 3, 60);
    //   const lessons = utils.sortLessons(data);
    //   this.setData({
    //     holiday: false,
    //     lessons,
    //     loading: false
    //   });
    // } catch (error) {
    //   this.setData({
    //     holiday: true,
    //     loading: false
    //   });
    // }
    let openid = (await app.getOpenId()) || "";
    this.setData({
      holiday: false,
      loading: true
    })
    try {
      await weixin.bindBooking(app.globalData.host, this.data.selectedTime,
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
    const { id, mode } = e.currentTarget.dataset;
    if (mode === 32) {
      this.book(id)
    }
  },
  // 预约课程
  async book(id) {
    let result = await utils.checkUserAvailability(app);
    if (!result) {
      this.setData({
        showLogin: true
      });
      return;
    }
    try {
      let openid = (await app.getOpenId()) || "";
      result = await weixin.book(app.globalData.host, id, openid);
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
  async unbook(item) {
    try {
      const result = await utils.getStringAsync(app, `v1/unbook?id=${item.reservation_id}`);
      this.loadData();
    } catch (error) {

    }
  },
  // 成功登录后隐藏登陆元素
  onLoginSubmit(evt) {
    this.setData({
      showLogin: false
    });
  }


}

)