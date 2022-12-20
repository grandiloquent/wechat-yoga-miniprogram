// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "daily-schedule":"../../components/daily-schedule/daily-schedule"
// <daily-schedule app="{{app}}"></daily-schedule>


const utils = require('../../utils');

Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    selectedTime: Number,
    offset: {
      type: Number,
      value: -1
    },
    app: Object
  },
  data: {},
  lifetimes: {
    async attached() {

    },
    detached: function() {},
  },
  observers: {
    'offset': function(offset) {
      console.log(offset);
      const t = new Date().setHours(0, 0, 0, 0) / 1000;
      const dates = getDates(offset);
      this.setData({
        dates,
        selectedTime: offset ?  dates[0].time:t 
      });
    },
  },
  methods: {
    onClick(evt) {

      this.setData({
        selectedTime: evt.currentTarget.dataset.time
      });
      this.triggerEvent('submit', evt.currentTarget.dataset.time)
    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    onDailyScheduleSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})



function getDates(offset = 0) {
  const dates = [];
  const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  let sd = startDate.getTime();
  let start = 0;
  if (startDate.getDay() === 0) {
    start = sd / 1000 - 86400 * 6;
  } else {
    start = sd / 1000 - 86400 * (startDate.getDay() - 1);
  }
  for (let index = 0; index < 7; index++) {
    const now = new Date((start + 86400 * (index + offset)) * 1000);

    dates.push({
      id: index,
      week: sd === now.getTime() ? '今日' : weeks[now.getDay()],
      day: now.getDate(),
      month: now.getMonth(),
      time: now / 1000
    })
  }
  return dates;
}