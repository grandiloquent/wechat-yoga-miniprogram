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

// https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp
// https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
function getJson(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject();
        }

      },
      fail(error) {
        reject(error);
      }
    })
  });

}
function postData(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      method: 'POST',
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject();
        }

      },
      fail(error) {
        reject(error);
      }
    })
  });

}


// https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
async function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          resolve(res.code)
        } else {
          reject();
        }
      },
      fail: () => {
        reject();
      }
    });
  });
}

module.exports = {
  checkUpdate,
  getJson,
  getLoginCode,
  postData
};