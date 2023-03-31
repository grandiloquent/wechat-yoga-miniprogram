const utils = require('utils');


App({
  async onLaunch() {
    //await showMessageModal(wx.getSystemInfoSync().SDKVersion)

    // 更新小程序
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    });
    // 尝试读取登录缓存
    try {
      const res = await wx.getStorage({
        key: 'openid'
      });
      if (res.data) {
        this.globalData.openid = res.data;
        utils.debug(this, this.globalData.openid);
        return;
      }
    } catch (error) { }
    // 登录小程序
    if (!this.globalData.openid) {
      try {
        // 通过后端服务器请求微信鉴权获取用户OpenId
        // 相同的用户登录不同的小程序其OpenId也不同
        // 如果将OpenId作为用户标识，会影响数据迁移的可行性
        // 举例说，用户在A小程序的OpenIdA，在B为OpenIdB，如果要把A程序中的该用户的数据迁移到B，OpenIdA和OpenIdB并没有映射关系，无法简单迁移
        this.globalData.openid = await utils.getOpenId(this.globalData.host);
        wx.setStorage({
          key: "openid",
          data: this.globalData.openid
        });
        utils.debug(this, this.globalData.openid)
      } catch (error) {
        wx.showModal({
          content: JSON.stringify(error)
        });
      }
    }

  },
  globalData: {
    openid: null,
    // 'https://static.lucidu.cn'
    //  'https://lucidu.cn',
    // http://localhost:8082
    // 后端服务器的域名，该域名必须备案，且必须登录小程序官网，将该域名加入可合法请求的域名列表
    host: 'https://lucidu.cn',
    // CDN加速的地址
    staticHost: 'https://static.lucidu.cn',
    title: '晨蕴瑜伽'
  },
});
;
