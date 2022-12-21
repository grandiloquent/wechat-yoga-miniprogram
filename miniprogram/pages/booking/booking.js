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
      this.loadData(new Date().setHours(0, 0, 0, 0) / 1000)
    },
    navigate(e) {
      utils.navigate(e)
    },
    async loadData(start) {
      this.setData({
        lessons: null,
        holiday: false,
        loading: true
      })
      try {
        const data = await utils.getStringAsync(app, `v1/booking/query?start=${start}`);
        if (!data.length) {
          throw new Error()
        }
        utils.setLessonStatus(data, 3, 60);
        this.setData({
          holiday: false,
          lessons: data,
          loading: false
        });
      } catch (error) {
        this.setData({
          holiday: true,
          loading: false
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
    loadThisWeek() {
      console.log('---------');
    },
    onDailyScheduleSubmit(evt) {
      this.loadData(evt.detail)
    },
    async onBookingItemSubmit(evt) {
      const item = evt.detail;
      if (item.mode & 8) {
        await this.book(item)
      }
    },
    async book(item) {
      let result = await utils.checkUserAvailability(app);
      if (!result) {
        this.setData({
          showLogin: true
        });
        return;
      }
console.log(item);
      try {
        result = await utils.getStringAsync(app,`v1/book?id=${item.course_id}`);
        console.log(result);
      } catch (error) {

      }
    },
    onLoginSubmit(evt) {
      this.setData({
        showLogin: false
      });
    }


  }

)