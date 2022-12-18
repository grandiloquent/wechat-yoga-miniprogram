// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "user-profile":"../../components/user-profile/user-profile"
// <user-profile app="{{app}}"></user-profile>

const utils = require('../../utils');

Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    user: Object,
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
