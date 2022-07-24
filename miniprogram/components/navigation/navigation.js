const app = getApp();

Component({
  properties: {
    selected: Number,
    title: String,
  },
  data: {
    cdn: app.globalData.staticHost
  },
  methods: {
    onLeft(e) {
      this.setData({
        selected: 0
      });
      this.triggerEvent('selectedIndexChanged', this.data.selected);
      // bind:selectedIndexChanged="onSelectedIndexChanged"
    },

    onRight(e) {
      this.setData({
        selected: 1
      });
      this.triggerEvent('selectedIndexChanged', this.data.selected);
    },


  },
  pageLifetimes: {
    show() {
      const {
        screenWidth,
        statusBarHeight
      } = wx.getSystemInfoSync();
      // 胶囊按钮
      const {
        height,
        top,
        right
      } = wx.getMenuButtonBoundingClientRect();
      // 左边内边距
      const paddingLeft = screenWidth - right;
      const navigationHeight = (top - statusBarHeight) * 2 + height;
      this.setData({
        navigationHeight,
        navigationTop: statusBarHeight,
        paddingLeft
      });
    }
  }
})