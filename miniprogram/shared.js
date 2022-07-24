// const shared = require('../../shared');
async function checkUserStatus(app) {
  try {
    return await new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.host}/api/user/check?openId=${app.globalData.openid}`,
        success: res => {
          if (res.statusCode <= 299 && res.statusCode >= 200)
            resolve(res.data);
          else {
            reject(new Error(res.statusCode));
          }
        },
        fail: err => {
          reject(err);
        }
      });
    });
  } catch (error) {
    return false;
  }
}

function determineIfCourseIsOverdue(todayTimestamp, course, hour, minutes) {
  return todayTimestamp > course.dateTime ||
    (todayTimestamp == course.dateTime && minutes <= hour)
}

function parseTime(s) {
  const match = /(\d+):(\d+)/.exec(s);
  if (!match) return 0;
  return parseInt(match[1]) * 60 + parseInt(match[2]);
}

function getTodayTimestamp(now) {
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}


async function getUserInfo(app) {
  if (app.globalData.userInfo) {
    return;
  }
  try {
    const res = await new Promise((resolve, reject) => {
      wx.request({
        url: `${app.globalData.host}/api/user/${app.globalData.openid}?mode=3`,
        success: res => {
          if (res.statusCode <= 299 && res.statusCode >= 200)
            resolve(res.data);
          else
            reject(res.statusCode)
        },
        fail: err => {
          reject(err);
        }
      });
    });
    app.globalData.userInfo = res;
  } catch (error) {
    wx.showToast({
      title: "无法加载数据",
      icon: 'error'
    })
  }
}
async function request(url, ...arg) {
  return await new Promise((resolve, reject) => {
    wx.request(Object.assign({}, {
        url,
        success: res => {
          if (res.statusCode <= 299 && res.statusCode >= 200)
            resolve(res.data);
          else
            reject(res.statusCode)
        },
        fail: err => {
          reject(err);
        }
      },
      ...arg,
    ));
  });
}

function signIn(app, reservedId) {
  return new Promise((resolve, reject) => {
    wx.scanCode({
      success: async response => {
        try {
          wx.showLoading({
            title: "加载中..."
          })
          const res = await request(
            `${app.globalData.host}/api/book?reservedId=${reservedId}&mode=1&fulfill=1&${response.result}`
          )
          resolve(res);
        } catch (error) {
          reject(error);
        }
      },
      fail: err => {
        reject(err);
      }
    });
  })
}

const colors = ["rgb(244, 67, 54)", "rgb(233, 30, 99)", "rgb(156, 39, 176)", "rgb(103, 58, 183)", "rgb(63, 81, 181)", "rgb(33, 150, 243)", "rgb(3, 169, 244)", "rgb(0, 188, 212)", "rgb(0, 150, 136)", "rgb(76, 175, 80)", "rgb(139, 195, 74)", "rgb(205, 220, 57)", "rgb(255, 235, 59)", "rgb(255, 193, 7)", "rgb(255, 152, 0)", "rgb(255, 87, 34)", "rgb(121, 85, 72)", "rgb(158, 158, 158)", "rgb(96, 125, 139)"];



function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

function getRandomColor() {
  return colors[getRandomInt(0, colors.length)];
}

function setLessonStatus(lessons, throttleHours, minutesLimit) {

  // 128 已满额
  // 64 已签到
  // 32 正在上课
  // 16 准备开课
  // 8 预约
  // 4 签到
  // 2 取消预约
  // 1 已完成
  function minutesOf(s) {
    const match = /(\d+):(\d+)/.exec(s);
    if (!match) return 0;
    return parseInt(match[1]) * 60 + parseInt(match[2]);
  }
  const now = new Date();
  const hourInMinutes = now.getHours() * 60 * 60 + now.getMinutes() * 60;
  now.setHours(0, 0, 0, 0);
  for (let i = 0; i < lessons.length; i++) {
    // if (lessons[i].id === 4) {
    //   lessons[i].startTime = "6:00"
    //   lessons[i].endTime = "7:00"
    // }
    console.log(lessons[i]);
    const tmp = new Date(now);
    const todayTimestamp = tmp.getTime() / 1000;
    const startTime = lessons[i].startTime;
    const endTime = lessons[i].endTime;
    if (todayTimestamp > lessons[i].dateTime ||
      (todayTimestamp === lessons[i].dateTime && endTime <= hourInMinutes)) {
      lessons[i].mode = 1;
      continue;
    }
    const today = todayTimestamp === lessons[i].dateTime;

    if (lessons[i].count >= lessons[i].peoples || lessons[i].peoples < 0) {
      lessons[i].mode = 128;

      if (today && startTime > hourInMinutes && startTime - hourInMinutes < minutesLimit * 1000) {
        lessons[i].mode = 16;
      }
      if (today && hourInMinutes >= startTime && hourInMinutes <= endTime) {
        lessons[i].mode = 32;
      }
      if (today && lessons[i].reservedId && lessons[i].fulfill !== 1) {
        lessons[i].mode |= 4;
      }
      continue;
    }
    if (lessons[i].reservationId) {
      if (!today) {
        lessons[i].mode = 2
        continue;
      }
      if (startTime - hourInMinutes > throttleHours * 1000) {
        lessons[i].mode |= 2
      }
      if (lessons[i].fulfill === 1) {
        lessons[i].mode |= 64;
      } else {
        lessons[i].mode |= 4;
      }

      if (startTime > hourInMinutes && startTime - hourInMinutes < minutesLimit) {
        lessons[i].mode |= 16;
      }
      if (hourInMinutes >= startTime && hourInMinutes <= endTime) {
        lessons[i].mode |= 32;
      }



    } else {
      // 未预约 未过期
      if (today) {

        if (startTime > hourInMinutes && startTime - hourInMinutes < minutesLimit * 1000) {
          lessons[i].mode = 16;
          continue;
        }
        if (hourInMinutes >= startTime && hourInMinutes <= endTime) {
          lessons[i].mode = 32;
          continue;
        }

      }
      lessons[i].mode |= 8;
    }
  }
}
async function loadSecurity(app) {
  if (!app.security) {
    app.security = await new Promise((resolve, reject) => {
      wx.request(Object.assign({}, {
        url: `${app.globalData.host}/api/preferences?mode=6`,
        success: res => {
          if (res.statusCode <= 299 && res.statusCode >= 200)
            resolve(res.data);
          else
            reject(res.statusCode)
        },
        fail: err => {
          reject(err);
        }
      }, ));
    });
  }
}

function getWeek(date) {
  let week;
  if (date.getDay() === 0) {
    week = '日';
  }
  if (date.getDay() === 1) {
    week = '一';
  }
  if (date.getDay() === 2) {
    week = '二';
  }
  if (date.getDay() === 3) {
    week = '三';
  }
  if (date.getDay() === 4) {
    week = '四';
  }
  if (date.getDay() === 5) {
    week = '五';
  }
  if (date.getDay() === 6) {
    week = '六';
  }
  return week;
}

function parseDate(string) {
  const match = /(\d{4})[年-](\d{1,2})[月-](\d{1,2})/.exec(string);
  const now = new Date(match[1], parseInt(match[2]) - 1, match[3]);
  return now;
}

function formatLessons(app, data) {
  const lessons = data;
  setLessonStatus(lessons,
    (app.security && app.security.throttleHours) || 3,
    (app.security && app.security.minutesLimit) || 60);
  return lessons.sort((x, y) => {
    const dif = x.dateTime - y.dateTime;
    if (dif != 0) {
      return dif;
    } else {
      return parseInt(x.startTime.split(':', 2)[0]) -
        parseInt(y.startTime.split(':', 2)[0])
    }
  });
}

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

function fuzzysearch(needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

function loadData(url, key, page, obj) {
  wx.request({
    url,
    ...obj,
    success: res => {
      if (res.statusCode <= 299 && res.statusCode >= 200) {
        if (key && {}.toString.call(key) === '[object Function]') {
          key(res.data)
        } else {
          page.setData({
            [key]: res.data
          })
        }
      } else {
        console.log(res.statusCode);
        wx.showToast({
          title: "网络不稳定",
          icon: 'error'
        })
      }
    },
    fail: err => {
      wx.showToast({
        title: "网络不稳定",
        icon: 'error'
      })
    }
  });
}

function createUrl(app, query, obj) {
  let url = `${app.globalData.host}/api/${query}?`;
  for (const key in obj) {
    url += `&${key}=${obj[key]}`
  }
  return url;
}

function createQueryBook1(app, e) {
  return createUrl(app, "book/1", {
    id: e.currentTarget.dataset.reservedid,
  })
}

function queryBook1(app, page, e, callback) {
  loadData(
    createQueryBook1(app, e),
    (data) => {
      callback && callback();
    }, page
  )
}


function queryStudent1(app, page, callback) {
  if (app.globalData.userInfo && app.globalData.userInfo.nickName) {
    return callback(0);
  }
  wx.request({
    url: `${app.globalData.host}/api/student/1?openId=${app.globalData.openid}`,
    success: res => {
      if (res.statusCode <= 299 && res.statusCode >= 200) {
        app.globalData.userInfo = res.data;
        callback(0)
      } else {
        page.setData({
          showLogin: true
        })
        callback(1);
      }
    },
    fail: err => {
      wx.showToast({
        title: "网络不稳定",
        icon: 'error'
      })
    }
  });
}
// queryStudent1(app,this,()=>{});
// queryStudent1

function queryBook2(app, id, callback) {
  wx.request({
    url: `${app.globalData.host}/api/book/2?openId=${app.globalData.openid}&id=${id}`,
    success: res => {
      if (res.statusCode <= 299 && res.statusCode >= 200) {
        callback && callback(res.data);
      } else {
        wx.showToast({
          title: "网络不稳定",
          icon: 'error'
        })
      }
    },
    fail: err => {
      wx.showToast({
        title: "网络不稳定",
        icon: 'error'
      })
    }
  });
};
// // queryBook2(app,(data)=>{
// this.setData({
//     key:data
// });
// });
// queryBook2,

module.exports = {
  checkUserStatus,
  determineIfCourseIsOverdue,
  getTodayTimestamp,
  getUserInfo,
  request,
  signIn,
  getRandomColor,
  setLessonStatus,
  loadSecurity,
  getWeek,
  parseDate,
  formatLessons,
  calculateNavigationBarSize,
  fuzzysearch,
  loadData,
  createUrl,
  queryBook1,
  queryStudent1,
  queryBook2,
  send,
  fetch,
  execute,
  fetchAsync,
  post,
  todayDateSeconds
};

function getAsync() {

}

function getByteArrayAsync() {

}

function getStreamAsync() {

}

function getStringAsync() {

}

function patchAsync() {

}

function post(page, path, obj, fn) {
  wx.request({
    url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}`,
    method: 'POST',
    data: obj,
    success: res => {
      if (res.statusCode === 200) {
        fn && fn(res.data)
      } else if (res.statusCode === 204) {
        fn && fn();
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
      })
    }
  })
}

function putAsync() {

}

function fetch(page, path, query, key) {
  let p = '';
  if (query && query.length) {
    const parameters = [];
    for (let index = 0; index < query.length; index += 2) {
      parameters.push(`${query[index]}=${query[index + 1]}`);
    }
    p = `&${ parameters.join('&')}`;
  }
  wx.request({
    url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}${p}`,
    success: res => {
      if (res.statusCode === 200) {
        key && page.setData({
          [key]: res.data
        });
      } else if (res.statusCode === 204) {

        key && page.setData({
          [key]: []
        });
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
      })
    }
  })
}

function fetchAsync(page, path, query) {
  let p = '';
  if (query && query.length) {
    const parameters = [];
    for (let index = 0; index < query.length; index += 2) {
      parameters.push(`${query[index]}=${query[index + 1]}`);
    }
    p = `&${ parameters.join('&')}`;
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}${p}`,
      success: res => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 204) {
          resolve([]);
        } else {
          reject(res.statusCode);
        }
      },
      fail: err => {
        reject();
      }
    })
  })
}


function execute(page, path, query, fn) {
  let p = '';
  if (query && query.length) {
    const parameters = [];
    for (let index = 0; index < query.length; index += 2) {
      parameters.push(`${query[index]}=${query[index + 1]}`);
    }
    p = `&${ parameters.join('&')}`;
  }
  wx.request({
    url: `${page.data.app.globalData.host}/api/${path}?openId=${page.data.app.globalData.openid}${p}`,
    success: res => {
      if (res.statusCode === 200) {
        fn && fn(res.data)
      } else if (res.statusCode === 204) {
        fn && fn()
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
      })
    }
  })
}


function send(page, path, obj, fn) {
  wx.request({
    url: `${page.data.app.globalData.host}/api/${path}`,
    data: Object.assign({}, {
      openId: page.data.app.globalData.openid
    }, obj),
    success: res => {
      if (res.statusCode === 200) {
        fn && fn(res.data)
      } else if (res.statusCode === 204) {
        fn && fn();
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
      })
    }
  })
}

console.log("Get today's timestamp");

function todayDateSeconds() {
  const n = new Date();
  const s = Math.floor(n.getTime() / 1000);
  return [s - s % 86400 - 28800,
    n.getHours() * 60 * 60 + n.getMinutes() * 60
  ];
}
/*
```
explain analyse
select course.id                                 as course_id,
       course.peoples,
       (select count(reservation.id)
        from reservation
        where reservation.course_id = course.id) as count,
       (select reservation.id
        from reservation
                 join "user" u on u.id = reservation.user_id
        where u.open_id = 'oQOVx5Dxk0E6NQO-Ojoyuky2GVR8'
          and reservation.course_id = course.id
        limit 1)                                 as reservation_id,
       course.start_time,
       course.end_time,
       course.date_time,
       l.name                                    as lesson_name,
       c.name                                    as teacher_name,
       c.thumbnail
from course
         join coach c on course.teacher_id = c.id
         join lesson l on l.id = course.lesson_id
where course.hidden <> 1
  and course.date_time >= 1657814400
  and course.date_time <= 1658419200
  and course.class_type & 4 = course.class_type
  and teacher_id = 6;
```
  */