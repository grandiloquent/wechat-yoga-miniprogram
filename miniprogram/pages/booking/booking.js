const utils = require('../../utils')
const app = getApp();

Page({
    data: {
      app,
      offse: -1
    },
    async onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      wx.setNavigationBarTitle({
        title: app.globalData.title
      })

    },
    navigate(e) {
      utils.navigate(e)
    },
    async loadData() {
      utils.getString(app, "api/", (err, data) => {
        if (err) return;
        this.setData({
          key: data
        });
      });
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
    loadThisWeek() {
      console.log('---------');
    },
    onDailyScheduleSubmit(evt) {
      console.log(evt.detail)
    }
  }

)