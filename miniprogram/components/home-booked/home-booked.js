// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-booked":"../../components/home-booked/home-booked"
// <home-booked app="{{app}}"></home-booked>

const utils = require('../../utils');

Component({
  properties: {
    items: {
      type: Array,
    },
    app:Object
  },
  data: {
  },
   lifetimes: {
    async attached() {
     
    },
    detached: function () {
    },
  },
  methods: {
   onClick(evt){
      this.triggerEvent('submit')
    }
  }
})
