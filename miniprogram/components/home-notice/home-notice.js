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
      type: Array
    },
    app: Object
  }, observers: {
    'items': function (items) {
      this.setData({
        notices: items.map(x => {
          x.timeago = utils.timeago(x.updated_time)
          return x;
        })
      })
    },
  },
  methods: {
    navigate(evt) {
      this.triggerEvent('submit', evt.currentTarget.dataset.id)
    }
  }
})
