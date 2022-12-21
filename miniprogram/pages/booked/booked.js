const utils = require('../../utils')
const app = getApp();

Page({
  data: {
    app
  },
  async onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
    const t = new Date().setHours(0, 0, 0, 0);
    this.data.startTime = t / 1000;
    this.data.endTime = 86400 + this.data.startTime;
    this.loadData();
  },
  async loadData() {
    utils.getString(app, `v1/booked/query?startTime=${this.data.startTime}&endTime=${this.data.endTime}`, (err, data) => {
      if (err || !data) {
        this.setData({
          lessons: null
        })
        return;
      }

      const now = new Date();
      const currentSeconds = now.getHours() * 60 * 60 + now.getMinutes() * 60;
      const todayTimestamp = now.setHours(0, 0, 0, 0) / 1000;
      this.setData({
        lessons: utils.sortLessons(data.map((element, index) => {
          element.time = `${utils. formatDuration( element.start_time)}-${utils.formatDuration( element.end_time)}`;
          element.shortDate = utils.formatLessonShortDate(element);
          if (element.date_time > todayTimestamp || (element.date_time === todayTimestamp && element.start_time > currentSeconds && element.start_time - currentSeconds > 3 * 3600)) {
            element.expired = false;
          } else {
            element.expired = true;
          }
          return element;
        }))
      });
    });
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onHeaderSubmit(evt) {
    const t = new Date().setHours(0, 0, 0, 0);

    switch (evt.detail) {
      case 1:
        this.data.startTime = t / 1000;
        this.data.endTime = 86400 + this.data.startTime;
        break;
      case 2:
        this.data.startTime = t / 1000 + 86400;
        this.data.endTime = 86400 + this.data.startTime;
        break;
      case 3:
        this.data.startTime = t / 1000;
        this.data.endTime = 86400 * 7 + this.data.startTime;
        break;
      case 4:
        this.data.endTime = t / 1000;
        this.data.startTime = this.data.endTime - 365 * 86400;
        break;
    }
    this.loadData();
  },
  navigate(evt) {
    utils.navigate(evt);
  },

async onSubmit(evt){
try {
        const result = await utils.getStringAsync(app, `v1/unbook?id=${evt.currentTarget.dataset.id}`);
        this.loadData();
      } catch (error) {

      }
}
})