const app = getApp();
const shared = require('../../utils/shared')
import init, {
  lessons_and_teachers
} from "../../pkg/admin";

Page({
  data: {
    app,
lessonIndex:0,
teachersIndex:0,
startTimesIndex:0,
peoplesIndex:0
  },
  // 通过 URL 查询参数获取待查
  // 询的课程标识
  async onLoad(options) {

    this.data.id = options.id || 1323;
    await init();
    this.loadData();
  },
  async loadData() {

    await lessons_and_teachers(this, app.globalData.host,  this.data.id,app.globalData.openid || (await app.getOpenId()));

  },
  onShow() {
    this.setData({
      background: shared.getRandomColor()
    })
  },
  onLessonChange(e) {
    this.setData({lessonIndex:parseInt(e.detail.value)});
  },

 onTeachersChange(e) {
 this.setData({teachersIndex:parseInt(e.detail.value)});
 },
onStartTimesChange(e) {
 this.setData({startTimesIndex:parseInt(e.detail.value)});
 },
onPeoplesChange(e) {
 this.setData({peoplesIndex:parseInt(e.detail.value)});
 },
onSubmit(){
console.log(this.data); 
}
});