Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
{
  "usingComponents": {
    "action-items":"../../components/action-items/action-items"
  }
}
,"action-items":"components/action-items/action-items"
<action-items></action-items>
    */
  properties: {
    items: {
      type:Array
    },
  },
  data: {
  },
  methods: {

    tabClick(e) {
      const id = e.currentTarget.dataset.id;
      if (id === 1) {
        wx.navigateTo({
          url: '/pages/encyclopedias/encyclopedias',
        })
        return;
      }
      if (id === 2 ) {
        wx.switchTab({
          url: '/pages/appointment/index',
        })
      } else
      if (id === 3) {
        wx.navigateTo({
          url: '/pages/coaches/index',
        })
      } else
      if (id === 7) {
        wx.navigateTo({
          url: '/pages/announcements/index',
        })
      } else
      if (id === 4) {
        wx.navigateTo({
          url: '/pages/vipList/vipList',
        })
      } else if (id === 6) {
        wx.navigateTo({
          url: "/pages/discount/index",
        })
      } else {
        wx.navigateTo({
          url: "/pages/photoWall/index"
        })
      }
    }

  }
})