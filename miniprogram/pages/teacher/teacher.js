const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app,
    type: 4
  },
  async loadData() {
    this.setData({
      lessons: null,
      holiday: false,
      loading: true
    })
    try {
      let now = new Date();
      now.setHours(0, 0, 0, 0);
      const data = await utils.getStringAsync(app, `v1/teacher/lessons?teacherId=${this.data.id}&startTime=${now.getTime()/1000}&endTime=${now.getTime()/1000+86400 * 7}&classType=${this.data.type}`);
      if (!data.length) {
        throw new Error()
      }
      utils.setLessonStatus(data, 3, 60);
      const lessons = utils.sortLessons(data).map((element, index) => {
        element.teacher_name = utils.formatLessonShortDate(element);
        return element;
      })
      this.setData({
        holiday: false,
        lessons,
        loading: false
      });
    } catch (error) {
      console.log(error)
      this.setData({
        holiday: true,
        loading: false
      });
    }
  },
  async onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
    this.data.id = options.id || 3;
    utils.getString(app, `v1/teacher?id=${this.data.id}`, (err, data) => {
      if (err) return;
      this.setData({
        teacher: data
      });
    });
    this.loadData();
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onShareSubmit(evt) {
    console.log(evt.detail)
  },
  onShow() {
    this.setData({
      background: utils.getRandomColor()
    })
  },
  async onTeacherButtonsSubmit(evt) {
    this.data.type = (evt.detail === 1 && 4) || (evt.detail === 2 && 2) || (evt.detail === 3 && 1)
    await this.loadData();
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
})