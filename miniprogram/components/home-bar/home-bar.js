// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-bar":"../../components/home-bar/home-bar"
// <home-bar app="{{app}}"></home-bar>
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
      const { navigationHeight, navigationTop } = utils.calculateNavigationBarSize();
      this.setData({
        height: `${navigationHeight}px`,
        top: `${navigationTop}px`
      })
      utils.getWeather(res => {
        this.setData({
          weather: utils.formatWeather(res)
        })
      })

    },
    detached: function () {
    },
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { }
  }
})
