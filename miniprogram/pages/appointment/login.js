// const login =require('/login');
module.exports = async (app, page) => {
  if (!app.globalData.userInfo) {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.request({
          url: `${app.globalData.host}/api/user?mode=2&openId=${app.globalData.openid}`,
          success: res => {
            if (res.statusCode == 404) {
              reject();
            } else {
              resolve(res)
            }
          },
          fail: err => {
            reject(err);
          }
        });
      });
      app.globalData.userInfo = res.data;
    } catch (error) {
      this.setData({
        showLogin: true
      });
      return false;
    }
  }
  if (!app.globalData.userInfo || !app.globalData.userInfo.nick_name) {
    page.setData({
      showLogin: true
    })
    return false;
  }
  return true;
}