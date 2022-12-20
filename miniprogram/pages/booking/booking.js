const utils = require('../../utils')
const app = getApp();

Page({
    data: {
      app,
      offse: -1
    },
    async onLoad() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      wx.setNavigationBarTitle({
        title: app.globalData.title
      })
      this.loadData(new Date().setHours(0, 0, 0, 0) / 1000)
    },
    navigate(e) {
      utils.navigate(e)
    },
    async loadData(start) {
      this.setData({
        lessons: null,
        holiday: false,
        loading: true
      })
      try {
        const data = await utils.getStringAsync(app, `v1/booking/query?start=${start}`);
        if (!data.length) {
          throw new Error()
        }
        setLessonStatus(data, 3, 60);
        this.setData({
          holiday: false,
          lessons: data,
          loading: false
        });
      } catch (error) {
        this.setData({
          holiday: true,
          loading: false
        });
      }
    },
    onShareAppMessage() {
      return {
        title: app.globalData.title
      };
    },
    onBookingBarSubmit(evt) {
      if (evt.detail === "1") {
        this.setData({
          offset: 0
        });

      } else {
        this.setData({
          offset: 7
        });
      }
    },
    loadThisWeek() {
      console.log('---------');
    },
    onDailyScheduleSubmit(evt) {
      this.loadData(evt.detail)
    },
    async onBookingItemSubmit(evt) {
      const item = evt.detail;
      if (item.mode & 8) {
        await this.book(item)
      }
    },
    async book(item) {
      console.log(item)
      utils.getString(app, "v1/book", (err, data) => {
        if (err) return;
        this.setData({
          key: data
        });
      });
    }


  }

)

function getCurrentSeconds(now) {
  return now.getHours() * 60 * 60 + now.getMinutes() * 60;
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

function checkIfBooked(todayTimestamp, lesson, currentSeconds, minutesLimit, throttleHours) {
  if (lesson.reservationId) {
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

function setLessonStatus(lessons, throttleHours, minutesLimit) {
  // 128 已满额
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
    //   lessons[i].dateTime = nn.getTime() / 1000;
    //   lessons[i].startTime = parseDuration("14:00")
    //   lessons[i].endTime = lessons[i].startTime + 3600
    //   lessons[i].peoples = 6;
    //   lessons[i].reservationId = 1;
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
      if (lessons[i].start_time > currentSeconds && lessons[i].start_time - currentSeconds < minutesLimit * 60) {
        lessons[i].mode = 16;
        continue;
      }
      if (currentSeconds >= lessons[i].start_time && currentSeconds <= lessons[i].end_time) {
        lessons[i].mode = 32;
        continue;
      }
    }
    lessons[i].mode |= 8;
  }
}
