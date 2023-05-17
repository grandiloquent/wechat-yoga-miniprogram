const utils = require('../../utils')
const app = getApp();
import init, {
  teacher_lessons,
  book,
  unbook,
  user_query
} from "../../pkg/weixin";

Page({
  data: {
    app,
    type: 4
  },
  async loadData() {
    let now = new Date();
    now.setHours(0, 0, 0, 0);
    const startTime = now.getTime() / 1000;
    const endTime = startTime + 86400 * 7;
    const openId = await app.getOpenId();
    const classType = this.data.type;
    const teacherId = this.data.id;
    await teacher_lessons(this, app.globalData.host, startTime, endTime, openId, classType, teacherId);
  },
  async onLoad(options) {
    this.data.id = options.id || 3;
    await init();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.setNavigationBarTitle({
      title: app.globalData.title
    });
    this.loadData();
  },
  onShareAppMessage() {
    return {
      title: app.globalData.title
    };
  },
  onShareSubmit(evt) {
    console.log(evt.detail)
  },
  onShow() {
    this.setData({
      background: utils.getRandomColor()
    })
  },
  async onTeacherButtonsSubmit(evt) {
    this.data.type = (evt.detail === 1 && 4) || (evt.detail === 2 && 2) || (evt.detail === 3 && 1)
    try {
      await this.loadData();
    } catch (error) {
      this.setData({ lessons: null });
    }
  },
  async onClick(e) {
    const { id, bookid, mode } = e.currentTarget.dataset;
    if (mode === 32) {
      this.book(id)
    } else if (mode === 64) {
      this.unbook(bookid)
    }
  },
  // 预约课程
  async book(id) {
    let result = await checkUserAvailability(app);
    if (!result) {
      wx.navigateTo({
        url: `/pages/login/login?return_url=$${encodeURIComponent(`/pages/teacher/teacher?id=${this.data.id}`)}`
      })
      return;
    }
    try {
      let openid = (await app.getOpenId()) || "";
      result = await book(app.globalData.host, id, openid);
      if (result > 0) {
        await this.loadData();
      }
      else {
        wx.showModal({
          title: '信息',
          content: '请您购买会员卡',
          success: res => {
            if (res.confirm) {

            }
          }
        })
      }
    } catch (error) {

    }
  },
  async unbook(bookid) {
    try {
      await unbook(app.globalData.host, bookid, app.globalData.openid);
      await this.loadData();
    } catch (error) {
      console.log(error)
    }
  },
});
async function checkUserAvailability(app) {
  if (!app.globalData.openid) {
    return false;
  }
  if (app.globalData.userId) {
    return true;
  }
  let result;
  try {
    result = await user_query(app.globalData.host, app.globalData.openid);
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