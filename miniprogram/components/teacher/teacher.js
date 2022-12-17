// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "teacher":"../../components/teacher/teacher"
// <teacher app="{{app}}"></teacher>

const utils = require('../../utils');

Component({
  properties: {
    items: Object,
    app: Object
  },
  data: {
  },
  lifetimes: {
    async attached() {
      console.log(this.data)
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
