// 谷歌 Material 500 的颜色
// Those values are the relative lightness/darkness or "tint" of the color, where 50 is lightest and 900 is darkest. The Material Design guidelines suggest using the 500 tint as your primary color and the 700 tint as the darker status bar color.
const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];
// const SECONDS_IN_TIME = [
//   1, // 1 second
//   60, // 1 minute
//   3600, // 1 hour
//   86400, // 1 day
//   604800, // 1 week
//   2419200, // 1 month
//   29030400 // 1 year
// ];
// const en_US = [
//   "刚刚", "秒之前",
//   "1 分钟之前", "分钟之前",
//   "1 小时之前", "小时之前",
//   "1 天之前", "天之前",
//   "1 周之前", "周之前",
//   "1 月之前", "月之前",
//   "1 年之前", "年之前"
// ]
// 计算微信顶部导航栏的尺寸，用于自定义导航栏
function calculateNavigationBarSize() {
  const {
    screenWidth,
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
  const navigationHeight = (top - statusBarHeight) * 2 + height;
  return {
    navigationHeight,
    navigationTop: statusBarHeight,
    paddingLeft,
  }
}


function checkIfBooked(todayTimestamp, lesson, currentSeconds, minutesLimit, throttleHours) {
  if (lesson.reservation_id) {
    if (todayTimestamp < lesson.date_time) {
      lesson.mode = 2
      return true;
    }
    if (lesson.start_time - currentSeconds > throttleHours * 60) {
      lesson.mode = 2
    }
    if (lesson.fulfill === 1) {
      lesson.mode |= 64;
    } else {
      lesson.mode |= 4;
    }
    if (lesson.start_time > currentSeconds && lesson.start_time - currentSeconds < minutesLimit * 60) {
      lesson.mode |= 16;
    }
    if (currentSeconds >= lesson.start_time && currentSeconds <= lesson.end_time) {
      lesson.mode |= 32;
    }
    return true;
  }
  return false;
}

function checkIfLessonExpired(todayTimestamp, lesson, currentSeconds) {
  // First check if it is a class before today
  // If it's today's class, check if the current time exceeds the class end time
  if (todayTimestamp > lesson.date_time ||
    (todayTimestamp === lesson.date_time && lesson.end_time <= currentSeconds)) {
    lesson.mode = 1;
    return true;
  }
  return false;
}

function checkIfLessonFullyBooked(todayTimestamp, lesson, currentSeconds, minutesLimit) {
  if (lesson.count >= lesson.peoples || lesson.peoples < 0) {
    lesson.mode = 128;
    if (todayTimestamp === lesson.dateTime) {
      if (lesson.start_time > currentSeconds &&
        lesson.start_time - currentSeconds < minutesLimit * 60) {
        lesson.mode = 16;
      } else if (currentSeconds >= lesson.start_time && currentSeconds <= lesson.end_time) {
        lesson.mode = 32;
      }
      // if (today && lesson.reservedId && lesson.fulfill !== 1) {
      //   lesson.mode |= 4;
      // }
    }
    return true;
  }
  return false;
}


function chooseImage() {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        resolve(res.tempFilePaths[0]);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

function debug(app, openid) {
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
    open_id: openid
  };
  postString(app, "debug", data)
}

function formatDate(ms) {
  const t = new Date(ms);
  return `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${(t.getDate()).toString().padStart(2, '0')} ${(t.getHours()).toString().padStart(2, '0')}:${(t.getMinutes()).toString().padStart(2, '0')}:${(t.getSeconds()).toString().padStart(2, '0')}`;
}

function getCurrentSeconds(now) {
  return now.getHours() * 60 * 60 + now.getMinutes() * 60;
}

// 获取随机颜色
function getRandomColor() {
  return colors[getRandomInt(0, colors.length)];
}
// 获取一定范围内的颜色
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}
// 异步非等待请求远程数据，应尽量使用此函数，以提高程序整体流畅度
function getString(app, path, callback, arg) {
  wx.request({
    url: `${app.globalData.host}/${path}${path.indexOf('?') === -1 ? '?' : '&'}openId=${app.globalData.openid}`,
    ...arg,
    success: response => {
      if (response.statusCode === 404) {
        callback(new Error())
        return
      }
      callback(null, response.data)
    },
    fail: error => {
      callback(error)
    }
  });
}

function getStringAsync(app, path, arg) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.host}/${path}${path.indexOf('?') === -1 ? '?' : '&'}openId=${app.globalData.openid}`,
      ...arg,
      success: response => {
        if (response.statusCode > 399 || response.statusCode < 200) {
          reject(new Error(response.statusCode));
          return
        }
        resolve(response.data)
      },
      fail: error => {
        reject(error)
      }
    });
  });
}




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

function postString(app, path, data, callback, arg) {
  wx.request({
    url: `${app.globalData.host}/${path}${path.indexOf('?') === -1 ? '?' : '&'}openId=${app.globalData.openid}`,
    method: 'POST',
    data,
    ...arg,
    success: response => {
      callback && callback(null, response.data)
    },
    fail: error => {
      callback && callback(error)
    }
  });
}

// 异步Http请求函数
function request(url, arg) {
  /*
    https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
  const res = await utils.request(
          `${app.globalData.host}/v/user`, {
          method: 'POST',
          data: {
            avatarUrl, nickName, openid
          }
        });
    */
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      ...arg,
      success: response => {
        resolve(response)
      },
      fail: error => {
        reject(error)
      }
    });
  })
}

function setLessonStatus(lessons, throttleHours, minutesLimit) {
  // 256 已取消
  // 128 候补
  // 64 已签到
  // 32 正在上课
  // 16 准备开课
  // 8 预约
  // 4 签到
  // 2 取消预约
  // 1 已完成
  const now = new Date();
  const currentSeconds = getCurrentSeconds(now);
  now.setHours(0, 0, 0, 0);
  const todayTimestamp = now.getTime() / 1000;
  for (let i = 0; i < lessons.length; i++) {
    // if (i === 1) {
    //   const nn = new Date();
    //   nn.setHours(0, 0, 0, 0);
    //   lessons[i].date_time = nn.getTime() / 1000;
    //   lessons[i].start_time = parseDuration("18:00")
    //   lessons[i].end_time = lessons[i].start_time + 3600
    //   lessons[i].peoples = 1;
    //   lessons[i].reservationId = 1;
    //   lessons[i].count = 1;
    // }
    if (checkIfLessonExpired(todayTimestamp, lessons[i], currentSeconds)) {
      continue;
    }
    if (checkIfLessonFullyBooked(todayTimestamp, lessons[i], currentSeconds, minutesLimit)) {
      continue;
    }
    if (checkIfBooked(todayTimestamp, lessons[i], currentSeconds, minutesLimit, throttleHours)) {
      continue;
    }
    if (todayTimestamp === lessons[i].date_time) {

      if (((lessons[i].start_time > currentSeconds && lessons[i].start_time - currentSeconds < minutesLimit * 60)
      ) && lessons[i].hidden === -1) {
        lessons[i].mode = 256;
        continue;
      }
      if (lessons[i].start_time > currentSeconds && lessons[i].start_time - currentSeconds < minutesLimit * 60) {
        lessons[i].mode = 16;
        continue;
      }
      if (currentSeconds >= lessons[i].start_time && currentSeconds <= lessons[i].end_time) {
        if (lessons[i].hidden === -1) {
          lessons[i].mode = 1;
          continue;
        }
        lessons[i].mode = 32;
        continue;
      }
    }
    lessons[i].mode |= 8;
  }
}

// 简化显示真机调试信息
async function showMessageModal(content) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '询问',
      content,
      success(res) {
        if (res.confirm) {
          resolve()
        } else {
          reject();
        }
      }
    })
  });
}

function showModal(title, content, success) {
  wx.showModal({
    title,
    content,
    success: res => {
      if (res.confirm) {
        success()
      }
    }
  })
}

function sortLessons(data) {

  return data.sort((x, y) => {

    const dif = x.date_time - y.date_time;

    if (dif != 0) {
      return dif;
    } else {
      return x.start_time - y.start_time
    }
  });
}

function substringAfterLast(string, delimiter, missingDelimiterValue) {
  const index = string.lastIndexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(index + delimiter.length);
  }
} // https://github.com/tekinosman/timeago-js/blob/main/timeago.js


function uploadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url,
      filePath,
      name: 'images',
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

function formatLessonShortDate(lesson) {
  const t = new Date(lesson.date_time * 1000);
  return `${t.getMonth() + 1}月${t.getDate()}日`;
}
// 将秒钟转换为更通简的时间格式（9:30）
function formatDuration(ms) {
  // 先取余减掉小时，然后计算分钟
  var minutes = ms % 3600 / 60
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return Math.floor(ms / 3600) + ':' + minutes;
}
module.exports = {
  calculateNavigationBarSize,

  chooseImage,
  debug,
  formatDate,
  getRandomColor,
  getString,
  getStringAsync,
  navigate,
  postString,
  request,
  setLessonStatus,
  showMessageModal,
  showModal,
  sortLessons,
  substringAfterLast,
  uploadFile,
  formatLessonShortDate,
  formatDuration
}
// const utils = require('../../utils');