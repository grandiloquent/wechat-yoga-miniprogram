// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-bar":"../../components/home-bar/home-bar"
// <home-bar app="{{app}}"></home-bar>
const utils = require('../../utils');
const weixin = require('../../utils/weixin');

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
      const { navigationHeight, navigationTop } = utils.calculateNavigationBarSize();
      this.setData({
        height: `${navigationHeight}px`,
        top: `${navigationTop}px`,
        date: weixin.lunarTime()
      })
      this.setData({
        weather: await weixin.getWeather()
      })

      this.data.time = parseInt(await weixin.beijingTime());
      clearInterval(this.data.timer);
      this.setData({
        bj: utils.formatBeijingTime(this.data.time)
      });
      this.data.timer = setInterval(() => {
        this.data.time += 1000;
        this.setData({
          bj: utils.formatBeijingTime(this.data.time)
        });
      }, 1000);

    },
    detached: function () {
    },
  },
  methods: {
    // 这里是一个自定义方法
    customMethod: function () { }
  }
})
