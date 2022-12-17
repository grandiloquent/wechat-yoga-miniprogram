// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-actions":"../../components/home-actions/home-actions"
// <home-actions app="{{app}}"></home-actions>

const utils = require('../../utils');

Component({
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
    // 这里是一个自定义方法
    customMethod: function () { }
  }
})
