// 1.Google 设计 500 的主色。
// 2.在页面的 onShow 方法中获取该数组包含的随机颜色。
// 3.使用页面 setData 方法将随机颜色绑定视觉元素。
const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];

// 1.WebAssembly 发送 Http Get 请求的函数。
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
// 异步化函数
function promisify(api) {
  return (opt, ...arg) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, opt, {
        success: resolve,
        fail: reject
      }), ...arg)
    })
  }
}

async function getOpenId(app) {
  const code = await getLoginCode();
  const url = `${app.globalData.host}/yoga/auth?code=${code}`;
  const res = await getJson(url, code);
  return res.openid;
}
function getNavigationBarSize() {
  const {
    screenWidth,
    statusBarHeight
  } = wx.getSystemInfoSync();
  const {
    height,
    top,
    right
  } = wx.getMenuButtonBoundingClientRect();
  const paddingLeft = screenWidth - right;
  const navigationHeight = (top - statusBarHeight) * 2 + height;

  // console.log(`screenWidth = ${screenWidth}\n`,
  //   `statusBarHeight = ${statusBarHeight}\n`,
  //   `height = ${height}\n`,
  //   `top = ${top}\n`,
  //   `right = ${right}\n`, `paddingLeft = ${paddingLeft}\n`,
  //   `navigationHeight = ${navigationHeight}\n`);

  /* iPad
   screenWidth = 768
   statusBarHeight = 20
   height = 44
   top = 28
   right = 761
   paddingLeft = 7
   navigationHeight = 60
  */
  return {
    navigationHeight,
    navigationTop: statusBarHeight,
    paddingLeft,
    height
  }
}
async function checkUserAvailability(app, fn) {
  if (!app.globalData.openid) {
    return false;
  }

  if (app.globalData.userId) {
    return true;
  }

  let result;
  try {
    result = await fn(app)
    //TODO: check
    if (!result || !result.nick_name) {
      return false;
    }
    app.globalData.userId = result;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
async function setPage(app) {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  wx.setNavigationBarTitle({
    title: app.globalData.title
  });
}
// 1.跳转页面的封装函数。
// 2.在元素的定义中，使用目标页面的绝对路径添加 data-href 属性。
// 3.使用 bind:tap 将有类似行为的元素都绑定到相同的事件处理器。
// 4.在事件处理器中，使用事件对象调用该函数。
// 5.绑定底部导航栏的页面，必须使用 wx.switchTab 跳转。对于这类页面可以使用 data-tab 绑定绝对路径。
function navigate(e) {
  if (e.currentTarget.dataset.tab) {
    wx.switchTab({
      url: e.currentTarget.dataset.tab,
    })
  } else if (e.currentTarget.dataset.href) {
    wx.navigateTo({
      url: e.currentTarget.dataset.href + (e.currentTarget.dataset.id || ''),
    })
  }
}
// 获取一定范围内的颜色
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
// 获取随机颜色
function getRandomColor() {
  return colors[getRandomInt(0, colors.length)];
}
// 1.计算底部导航栏的高度。
// 2.在 iPad 等设备上可能出现底部导航栏遮挡用户界面的问题。
// 3.在页面文件的底部，添加一个与底部导航栏等高的元素可解决相关问题。
function getTabBarHeight() {
  const { screenHeight, windowHeight, statusBarHeight, pixelRatio
  } = wx.getSystemInfoSync();
  return (screenHeight - windowHeight - statusBarHeight) * pixelRatio;
}
module.exports = {
  getJson,
  getLoginCode,
  postData,
  getOpenId,
  getNavigationBarSize,
  setPage,
  checkUserAvailability,
  navigate,
  getRandomColor,
  getTabBarHeight
};