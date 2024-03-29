const shared = require("./utils/shared");

App({
  async onLaunch() {
    // 检查小程序是否可更新。如果有更新的版
    // 本，提示用户进行更新，如果用户同意更
    // 新，则停止进一步执行程序
    try {
      await checkUpdate();
    } catch (error) {
      return;
    }
    // 尝试读取缓存的 OpenId。OpenId 是
    // 用户相对于该小程序的唯一标识。
    // 但一旦小程序的程序 Id 
    // 变化。该标识也会变更。也就是
    // 说，它无法作为小程序之间通用的标识。
    try {
      const res = await wx.getStorage({
        key: 'openid'
      });
      if (res.data) {
        this.globalData.openid = res.data;
        debug(this)
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
        this.globalData.openid = await shared.getOpenId(this);
        wx.setStorage({
          key: "openid",
          data: this.globalData.openid
        });
        debug(this)
      } catch (error) {
        console.error(error);
        // wx.showModal({
        //   content: JSON.stringify(error)
        // });
      }
    }

  },
  async getOpenId() {
    if (this.globalData.openid) {
      return this.globalData.openid;
    }
    const res = await wx.getStorage({
      key: 'openid'
    });
    if (res.data) {
      this.globalData.openid = res.data;
      return res.data;
    }
    return null;
  },
  globalData: {
    openid: null,
    // https://lucidu.cn
    // http://localhost:8000
    // 后端服务器的域名，该域名必须备案，且必须登录小程序官网，将该域名加入可合法请求的域名列表
    host: 'https://lucidu.cn',
    // CDN加速的地址
    staticHost: 'https://lucidu.cn',
    title: '晨蕴瑜伽'
  },
});
;
function checkUpdate() {
  // https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.html
  const updateManager = wx.getUpdateManager();
  return new Promise((resolve, reject) => {
    updateManager.onCheckForUpdate(function (res) {
      if (!res.hasUpdate) {
        resolve();
      }
    });
    updateManager.onUpdateReady(() => {
      // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
            reject()
          } else {
            resolve()
          }
        },
        fail: () => {
          resolve()
        }
      });
    });
  });


}

// 记录访问小程序的设备信息，用于分析和统
// 计，比喻说优先测试最常见设备的兼容性
function debug(app) {
  const {
    brand,
    model,
    pixelRatio,
    screenHeight,
    screenWidth,
    version,
    SDKVersion,
    platform
  } = wx.getSystemInfoSync();
  const data = {
    brand,
    model,
    pixel_ratio: pixelRatio,
    screen_height: screenHeight,
    screen_width: screenWidth,
    version,
    sdk_version: SDKVersion,
    platform,
    open_id: app.globalData.openid
  };
  const url = `${app.globalData.host}/yoga/debug?openid=${app.globalData.openid}`
// 忽略请求结果
  wx.request({
    url,
    data,
    method: 'POST'
  });
}
