const app = getApp();
const shared = require('../../utils/shared')
import init, {
    query_lesson,
    suspend_lesson
} from "../../pkg/admin";

Page({
    data: {
        app,
        selected: 0,
        indexs: ["今天", "明天", "近七日", "近半月"]
    },
    // 通过 URL 查询参数获取待查
    // 询的课程标识
    async onLoad(options) {
        this.data.id = options.id || 1323;
        await init();
        this.loadData();
    },
    async loadData() {

        await query_lesson(this, app.globalData.host, this.data.id, app.globalData.openid || (await app.getOpenId()));

    },
    onShow() {
        this.setData({
            background: shared.getRandomColor()
        })
    },
    onDeleteUser(e) {
        // showModal
        // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
        wx.showModal({
            title: '询问',
            content: `您确定要取消"${e.currentTarget.dataset.name}"的预约吗？`,
            success: function (res) {
                if (res.confirm) {
                    this.loadData();
                }
            },
        });
    },
    onDeleteLesson() {
        const hidden = !this.data.hidden;
        wx.showModal({
            title: '询问',
            content: hidden ? '您确定要停课吗？' : '您确定要开课吗',
            success: async (res) => {
                if (res.confirm) {
                    await suspend_lesson(app.globalData.host, this.data.id, hidden ? 1 : 0, app.globalData.openid || (await app.getOpenId()));
                    this.loadData();
                }
            }
        });
    }
});
