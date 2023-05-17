const utils = require('../../utils')
const app = getApp();
import init, {
  teacher_lessons
} from "../../pkg/weixin";

Page({
  data: {
    app,
    type: 4
  },
  async loadData() {
    // this.setData({
    //   lessons: null,
    //   holiday: false,
    //   loading: true
    // })
    // try {
    //   let now = new Date();
    //   now.setHours(0, 0, 0, 0);
    //   const data = await utils.getStringAsync(app, `v1/teacher/lessons?teacherId=${this.data.id}&startTime=${now.getTime() / 1000}&endTime=${now.getTime() / 1000 + 86400 * 7}&classType=${this.data.type}`);
    //   if (!data.length) {
    //     throw new Error()
    //   }
    //   utils.setLessonStatus(data, 3, 60);
    //   const lessons = utils.sortLessons(data).map((element, index) => {
    //     element.teacher_name = utils.formatLessonShortDate(element);
    //     return element;
    //   })
    //   this.setData({
    //     holiday: false,
    //     lessons,
    //     loading: false
    //   });
    // } catch (error) {
    //   console.log(error)
    //   this.setData({
    //     holiday: true,
    //     loading: false
    //   });
    // }
    let now = new Date();
    now.setHours(0, 0, 0, 0);

    const startTime = now.getTime() / 1000;
    const endTime = startTime + 86400 * 7;
    const openId = await app.getOpenId();
    const classType = this.data.type;
    const teacherId = this.data.id;

    await teacher_lessons(this, app.globalData.host, startTime, endTime, openId, classType, teacherId);
    console.log(this.data);
  },
  async onLoad(options) {
    this.data.id = options.id || 3;


    await init();

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
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

  },
  async unbook(item) {

  },
})