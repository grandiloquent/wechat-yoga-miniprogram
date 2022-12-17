// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-bar":"../../components/home-bar/home-bar"
// <home-bar app="{{app}}"></home-bar>
const utils = require('../../utils');
const calendar = require('calendar');

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
      const t = new Date();
      this.setData({
        height: `${navigationHeight}px`,
        top: `${navigationTop}px`,
        date: calendar.solar2lunar(t.getFullYear(), t.getMonth() + 1, t.getDate())
      })
      utils.getWeather(res => {
        this.setData({
          weather: utils.formatWeather(res)
        })
      });
      utils.getNetworkTime(t => {
        this.data.time = t;
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
