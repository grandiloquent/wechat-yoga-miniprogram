App({

  async onLaunch() {

    const {
      screenWidth,
      // 顶部状态细条
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
    // 顶部减去状态栏的高度再乘以2得到导航栏的高度
    const navigationHeight = (top - statusBarHeight) * 2 + height;
    this.globalData.navHeight = navigationHeight;
    this.globalData.navTop = statusBarHeight;
    this.globalData.navLeft = paddingLeft
    checkUpdate();
    wx.request({
      url: `${this.globalData.host}/api/configs`,
      success: res => {
        if (res.statusCode === 200) {
          this.globalData.configs = res.data;
          this.globalData.ready&&this.globalData.ready();
        } else {
          wx.showToast({
            title: "网络不稳定",
            icon: "error"
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: "网络不稳定",
          icon: "error"
        });
      }
    })
    try {
      const res = await wx.getStorage({
        key: 'openid'
      });
      if (res.data) {
        this.globalData.openid = res.data;
        return;
      }
    } catch (error) {}
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-5gwr0r4t1ffd2b12',
        traceUser: true,
      });
    }
    this.addUser();

  },
  addUser() {
    wx.cloud.callFunction({
      name: "login",
      success: res => {
        this.globalData.openid = res.result.openid;
        wx.setStorage({
          key: "openid",
          data: this.globalData.openid
        });
      },
      fail(err) {
        wx.showToast({
          title: '请求失败，请重试',
          icon: 'none'
        })
      }
    });
  },
  globalData: {
    openid: null,
    host: 'https://lucidu.cn',
    staticHost: 'https://static.lucidu.cn'
  },
});

function checkUpdate() {
  const updateManager = wx.getUpdateManager();
  updateManager.onUpdateReady(function () {
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，是否重启应用？',
      success: function (res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate();
        }
      }
    })
  });
}