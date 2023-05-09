// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-bar":"../../components/home-bar/home-bar"
// <home-bar app="{{app}}"></home-bar>
const utils = require('../../utils'); 
import init,{beijing_time, lunar_time,get_weather} from "../../pkg/weixin";

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
      await init();
      const { navigationHeight, navigationTop } = utils.calculateNavigationBarSize();
      this.setData({
        height: `${navigationHeight}px`,
        top: `${navigationTop}px`,
        date: lunar_time()
      })
        this.setData({
          weather: await get_weather()
        })
      
        this.data.time =parseInt(await beijing_time());
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
