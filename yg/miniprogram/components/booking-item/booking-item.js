// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "booking-item":"../../components/booking-item/booking-item"
// <booking-item app="{{app}}"></booking-item>


const utils = require('../../utils');

Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    item: Object,
    app: Object
  },
  data: {},
  lifetimes: {
    async attached() {

    },
    detached: function () { },
  },
  observers: {
    'item': function (item) {
      this.setData({
        lesson: process(item)
      })
    },
  },
  methods: {
    onClick(evt) {
      this.triggerEvent('submit', evt.currentTarget.dataset.item)
    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    onBookingItemSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})


function process(item) {
  item.time = `${utils.formatDuration(item.start_time)}-${utils.formatDuration(item.end_time)}`;
  if ((item.mode & 1)) {
    item.label = "已完成"
  } else if ((item.mode & 2)) {
    item.label = "取消预约"
  } else if ((item.mode & 8)) {
    item.label = "预约"
  } else if ((item.mode & 16)) {
    item.label = "准备上课"
  } else if ((item.mode & 32)) {
    item.label = "正在上课"
  } 
  else if ((item.mode & 128)) {
    item.label = "已满额"
  } 
  else if ((item.mode & 256)) {
    item.label = "已取消"
  }

  return item;
}