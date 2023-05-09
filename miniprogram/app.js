const utils = require('utils');
const shard = require("./utils/shared");
import init,{get_open_id} from "./pkg/weixin";

App({
  async onLaunch() {
    // 检查小程序是否可更新。如果有更新的版
    // 本，提示用户进行更新，如果用户同意更
    // 新，则停止进一步执行程序
    try {
      await shard.checkUpdate();
    } catch (error) {
      return;
    }
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
        await init();
        // 通过后端服务器请求微信鉴权获取用户OpenId
        // 相同的用户登录不同的小程序其OpenId也不同
        // 如果将OpenId作为用户标识，会影响数据迁移的可行性
        // 举例说，用户在A小程序的OpenIdA，在B为OpenIdB，如果要把A程序中的该用户的数据迁移到B，OpenIdA和OpenIdB并没有映射关系，无法简单迁移
        this.globalData.openid = await get_open_id(this.globalData.host);
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
    // https://lucidu.cn
    // http://localhost:8002
    // 后端服务器的域名，该域名必须备案，且必须登录小程序官网，将该域名加入可合法请求的域名列表
    host: 'http://localhost:8002',
    // CDN加速的地址
    staticHost: 'https://static.lucidu.cn',
    title: '晨蕴瑜伽'
  },
});
;
