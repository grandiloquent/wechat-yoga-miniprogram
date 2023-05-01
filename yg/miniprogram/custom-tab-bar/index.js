// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "custom-tab-bar":"../../components/custom-tab-bar/custom-tab-bar"
// <custom-tab-bar app="{{app}}"></custom-tab-bar>



Component({

  properties: {
    items: {
      type: Array,
    },
    app: Object
  },
  data: {
    selected: 0
  },
  lifetimes: {
    async attached() {

    },
    detached: function() {},
  },
  observers: {
    'items': function(items) {

    },
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