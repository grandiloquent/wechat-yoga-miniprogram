const app = getApp();
const shared = require('../../shared');

Page({
  onRight(e) {
    this.onDate(1);
  },

  onLeft(e) {
    this.onDate(-1);
  },

  onDate(days) {
    const date =( this.data.date||new Date());
    date.setDate(date.getDate() + (days || 0))
    let week;
    if (date.getDay() === 0) {
      week = '日';
    }
    if (date.getDay() === 1) {
      week = '一';
    }
    if (date.getDay() === 2) {
      week = '二';
    }
    if (date.getDay() === 3) {
      week = '三';
    }
    if (date.getDay() === 4) {
      week = '四';
    }
    if (date.getDay() === 5) {
      week = '五';
    }
    if (date.getDay() === 6) {
      week = '六';
    }
    this.setData({
      dateString: `${date.getMonth()+1}月${date.getDate()}周${week}`
    });
  },

  onSelectIndexChanged(e) {
    if (e.detail == 0 || e.detail == 2) {
      wx.switchTab({
        url: `/pages/appointment/index`
      })
    }

  },

  data: {
    selected: 0,
    selectedDateTime: 0,
    loading: true,
    app,
    dates: getDates(), // 设置星期一到日
    selectedDateTime: new Date().setHours(0, 0, 0, 0), // 设置选定的时间
    initialized: false,
    selectedTabIndex: 1,
  },
  onSubmitData() {
    wx.navigateTo({
      url: '/pages/vipList',
    })
  },
  async book(e) {
    await shared.getUserInfo(app);
    if (!app.globalData.userInfo || !app.globalData.userInfo.nickName) {
      this.setData({
        showLogin: true,
        host: app.globalData.host,
        openid: app.globalData.openid
      })
      return;
    }

  },

  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    this.data.date=new Date();
    this.onDate();

  },
  onShareAppMessage() {
    return {
      title: '晨蕴瑜伽私人教练'
    }
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
    this.data.worker = wx.createWorker('workers/appointment.js');
    this.data.worker.onMessage((res) => {
      if (res.action === 1) {
        console.log(res.data)
        this.setData({
          teachers: res.data,
          loading: false
        });
      }
    });
    this.loadData();
  },

  loadData() {
    this.setData({
      loading: true
    });
    this.data.worker.postMessage({
      url: `${app.globalData.host}/api/teachers?mode=2`,
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
  async tapDate(e) {
    this.setData({
      // Switch to selected date
      selected: parseInt(e.currentTarget.dataset.id),
      selectedDateTime: new Date(e.currentTarget.dataset.time * 1000).setHours(0, 0, 0, 0)
    });
    // Load selected date course data
    // The date is appended to each control's dataset property
    this.loadData();
  },
  onLesson(e) {

  }
})

function getDates() {
  const dates = [];
  const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  for (let index = 0; index < 7; index++) {
    const now = new Date();
    now.setDate(now.getDate() + index);
    dates.push({
      id: index,
      week: index === 0 ? '今日' : weeks[now.getDay()],
      day: now.getDate(),
      month: now.getMonth(),
      time: ~~(now / 1000)
    })
  }
  return dates;
}