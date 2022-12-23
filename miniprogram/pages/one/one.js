const utils = require('../../utils')
const app = getApp();

Page({
    data: {
      app,
      offse: -1,
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
      this.data.selectedTime = new Date().setHours(0, 0, 0, 0) / 1000;
       this.setData({
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
        selected:3
      })
      this.loadData()
    },
    navigate(e) {
      utils.navigate(e)
    },
    async loadData() {
      this.setData({
        lessons: null,
        holiday: false,
        loading: true
      })
      try {
        const data = await utils.getStringAsync(app, `v1/booking/query?start=${this.data.selectedTime}&classType=2`);
        if (!data.length) {
          throw new Error()
        }
        utils.setLessonStatus(data, 3, 60);
        const lessons = utils.sortLessons(data);
        this.setData({
          holiday: false,
          lessons,
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
    onDailyScheduleSubmit(evt) {
      this.data.selectedTime = evt.detail
      this.loadData()
    },
    async onBookingItemSubmit(evt) {
      const item = evt.detail;
      if (item.mode & 6) {
        await this.unbook(item)
      } else if (item.mode & 8) {
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
      try {
        result = await utils.getStringAsync(app, `v1/book?id=${item.course_id}`);
        console.log(result);
        this.loadData();
      } catch (error) {

      }
    },
    async unbook(item) {
      try {
        const result = await utils.getStringAsync(app, `v1/unbook?id=${item.reservation_id}`);
        this.loadData();
      } catch (error) {

      }
    },
    onLoginSubmit(evt) {
      this.setData({
        showLogin: false
      });
    },onTabbarSubmit(evt) {
        console.log(evt.detail)
      }


  }

)
 