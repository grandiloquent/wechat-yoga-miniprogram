const app = getApp();
const shared = require('../../utils/shared')
import init, {
  lessons_and_teachers,
  lesson_update
} from "../../pkg/admin";

Page({
  data: {
    app,
    lessonIndex: 0,
    teachersIndex: 0,
    startTimesIndex: 0,
    peoplesIndex: 0,
    classTypesIndex: 0
  },
  // 通过 URL 查询参数获取待查
  // 询的课程标识
  async onLoad(options) {

    this.data.id = options.id || 1323;
    await init();
    this.loadData();
  },
  async loadData() {

    await lessons_and_teachers(this, app.globalData.host, this.data.id, app.globalData.openid || (await app.getOpenId()));
    let class_type = ((this.data.lesson.class_type === 1 && '小班') || (this.data.lesson.class_type === 2 && '私教') || (this.data.lesson.class_type === 4 && '团课'));
    this.setData({
      lessonIndex: this.data.lessons.indexOf(this.data.lesson.lesson_name),
      teachersIndex: this.data.teachers.indexOf(this.data.lesson.teacher_name),
      startTimesIndex: this.data.start_times.indexOf(formatSeconds(this.data.lesson.start_time).replace(/^0+/, '')),
      peoplesIndex: this.data.peoples.indexOf(this.data.lesson.peoples + ''),
      classTypesIndex: this.data.class_types.indexOf(class_type),
    }
    )
  },
  onShow() {
    this.setData({
      background: shared.getRandomColor()
    })
  },
  onLessonChange(e) {
    this.setData({ lessonIndex: parseInt(e.detail.value) });
  },

  onTeachersChange(e) {
    this.setData({ teachersIndex: parseInt(e.detail.value) });
  },
  onStartTimesChange(e) {
    this.setData({ startTimesIndex: parseInt(e.detail.value) });
  },
  onPeoplesChange(e) {
    this.setData({ peoplesIndex: parseInt(e.detail.value) });
  }, onClassTypesChange(e) {
    this.setData({ classTypesIndex: parseInt(e.detail.value) });
  },
  async onSubmit() {

    console.log(this.data);
    const class_type = this.data.class_types[this.data.classTypesIndex];
    const start_time = durationToSeconds(this.data.start_times[this.data.startTimesIndex] + ":00");
    const obj = {
      id: this.data.id,
      class_type: ((class_type === "团课") && 4)
        || ((class_type === "私教") && 2)
          ((class_type === "小班") && 1),
      start_time,
      end_time: start_time + 3600,
      peoples: parseInt(this.data.peoples[this.data.peoplesIndex]),
      old_start_time: this.data.lesson.start_time,
      old_class_type: this.data.lesson.class_type
    }
    await lesson_update(this, app.globalData.host, app.globalData.openid || (await app.getOpenId()),
      JSON.stringify(obj)
    );
    wx.showToast({
      title: "成功"
    });
  }
});

function formatSeconds(s) {
  if (isNaN(s)) return '0:00';
  if (s < 0) s = -s;
  const time = {
    hour: Math.floor(s / 3600) % 24,
    minute: Math.floor(s / 60) % 60,
  };
  return Object.entries(time)
    .filter((val, index) => index || val[1])
    .map(val => (val[1] + '').padStart(2, '0'))
    .join(':');
}

function durationToSeconds(duration) {
  let result = 0;
  if (/(\d{1,2}:){1,2}\d{1,2}/.test(duration)) {
    const pieces = duration.split(':');
    for (let i = pieces.length - 1; i > -1; i--) {
      result += Math.pow(60, i) * parseInt(pieces[pieces.length - i - 1]);
    }
    return result;
  }
  result = parseInt(duration);
  if (isNaN(result)) {
    result = 0;
  }
  return result;
}