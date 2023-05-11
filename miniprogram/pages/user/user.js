const utils = require('../../utils')
const app = getApp();
const shared = require('../../utils/shared')

import init, {
  user_query
} from "../../pkg/weixin";

Page({
  data: {
    app,
    showLogin: false
  },

  async loadData() {
    let openid = app.globalData.openid || await app.getOpenId();
    const res = await shared.checkUserAvailability(app, async () => {
      return await user_query(app.globalData.host, openid);
    });
    if (res) {
      this.setData({
        user: app.globalData.userId
      })
    }
    if (app.globalData.userId) {
      try {
        await checkAvatar(app.globalData.userId.avatar_url);
      } catch (error) {
        // showModal
        // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
        wx.showModal({
          title: '询问',
          content: '您的头像已失效，请更新？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: `/pages/login/login?return_url=${encodeURIComponent("/pages/user/user")}`
              })
            } else {

            }
          }
        });
      }

    }
  },
  navigate(e) {
    utils.navigate(e)
  },
  async onLoad() {
    shared.setPage(app);
    await init();

    this.getTabBar().setData({
      items: [{
        name: "首页",
        src: "home",
        href: "index"
      }, {
        name: "约课",
        src: "book",
        href: "booking"
      }, {
        name: "已约",
        src: "booked",
        href: "booked"
      }, {
        name: "我的",
        src: "user",
        href: "user"
      }

      ],
      selected: 3
    })
  },
  onLoginSubmit(evt) {
    this.setData({
      showLogin: false
    });
    this.loadData();
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onShow() {
    this.loadData();
    this.setData({
      backgroundColor: utils.getRandomColor()
    })
  },
  onUserProfileSubmit(evt) {
    if (evt.detail === '0') {
      this.setData({
        showLogin: true
      });
    }
  }
})

function onUserActionsSubmit(evt) {

}


// 测试微信用户头像是否已失效
// 应当紧测试微信提供的头像，如果头像保存在服务器，应该跳过以降低负载
function checkAvatar(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: 'GET',
      success: res => {
        // if (res.header['X-ErrNo'] === '-6101') {
        //     reject()
        // }
        if (res.statusCode > 400 || res.statusCode < 200) {
          reject();
        } else
          resolve()
      },
      fail: error => {
        reject(error)
      }
    })
  });
}


