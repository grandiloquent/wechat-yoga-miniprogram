// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-notice":"../../components/home-notice/home-notice"
// <home-notice app="{{app}}"></home-notice>

const utils = require('../../utils');

Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    items: {
      type: Array,
    },
    app: Object
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
    onClick(evt) {
      this.triggerEvent('submit')
    }
  }
})
