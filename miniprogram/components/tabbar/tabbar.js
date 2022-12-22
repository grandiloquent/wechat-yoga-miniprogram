// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "tabbar":"../../components/tabbar/tabbar"
// <tabbar app="{{app}}"></tabbar>

Component({

  properties: {
    items: {
      type: Array,
    },
    app: Object,
selected:{
type:Number,
value:0
}
  },
  methods: {
    onClick(evt) {
      const href = evt.currentTarget.dataset.href;
      const page = evt.currentTarget.dataset.page;
      if (page) {
        wx.navigateTo({
          url: `/pages/${href}/${href}`
        });
      } else {
        wx.switchTab({
          url: `/pages/${href}/${href}`
        });
      }

    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    onCustomTabBarSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})