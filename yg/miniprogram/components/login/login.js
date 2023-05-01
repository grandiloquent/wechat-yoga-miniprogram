const utils = require('../../utils');
const app = getApp();

Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
{
  "usingComponents": {
    "login":"../../components/login/login"
  }
}
    */
  properties: {},
  data: {
    //bound: utils.calculateNavigationBarSize(),
    avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
    nickName: '微信用户',
  },
  lifetimes: {
    async attached() {
      const isUserProtected = utils.isUserInfoProtected();
      if (isUserProtected) {
        this.setData({
          isUserProtected
        })
        try {
          const res = await utils.request(`${app.globalData.host}/api/user/5?openId=${app.globalData.openid}`)
          this.setData({
            avatarUrl: res.data.avatarUrl,
            nickName: res.data.nickName
          })
        } catch (error) {
        }
      }
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    async updateUserInfo(e) {

      try {

        const response = await utils.getUserProfile();
        app.globalData.userInfo = response.userInfo;
        const { avatarUrl, nickName } = app.globalData.userInfo;
        const open_id = app.globalData.openid;
        const res = await utils.request(
          `${app.globalData.host}/v1/user`, {
          method: 'POST',
          data: {
            avatar_url: avatarUrl, nick_name: nickName, open_id
          }
        });
        this.triggerEvent('success', response.userInfo)
      } catch (error) {
        this.triggerEvent('fail', error);
      }
    },
    async onUpdateUser() {
      if (!this.data.avatarUrl) {
        wx.showToast({
          icon: "error",
          title: "请设置头像"
        })
        return;
      }
      if (!this.data.nickName) {
        wx.showToast({
          icon: "error",
          title: "请输入昵称"
        })
        return;
      }
      const data = {
        avatar_url: this.data.avatarUrl,
        nick_name: this.data.nickName,
        open_id: app.globalData.openid
      }
      try {
        const res = await utils.request(`${app.globalData.host}/v1/user`, {
          data,
          method: 'POST'
        })
        this.triggerEvent('success', {
          avatarUrl: this.data.avatarUrl,
          nickName: this.data.nickName
        })
      } catch (error) {
        this.triggerEvent('fail', error);
      }
    },
    onChooseAvatar(e) {
      let { avatarUrl } = e.detail
      wx.uploadFile({
        url: `${app.globalData.host}/v1/picture`, //仅为示例，非真实的接口地址
        filePath: avatarUrl,
        name: 'images',
        success: res => {
          this.setData({
            avatarUrl: `${app.globalData.host}/images/${res.data}`,
          })
        }
      });
    },
    onNickNameInput(evt) {
      console.log(evt)
      this.data.nickName = evt.detail.value;
    }
  }
})