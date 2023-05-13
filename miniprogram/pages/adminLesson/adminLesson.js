const app = getApp();
const shared = require('../../utils/shared')
import init, {
    query_lesson
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
        let openid = app.globalData.openid || (await app.getOpenId());
        if (openid) {
            await query_lesson(this, app.globalData.host, this.data.id, openid);
        }
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
        const hidden = !this.data.lesson.hidden;
        wx.showModal({
            title: '询问',
            content: hidden ? '您确定要停课吗？' : '您确定要开课吗',
            success: async (res) => {
                if (res.confirm) {
                    await suspendLesson(app, this.data.id, hidden ? 1 : 0);
                    this.loadData();
                }
            }
        });
    }
});
function formatLessonDateTime(lesson) {
    const date = new Date(lesson.date_time * 1000);
    //  周${'日一二三四五六'[date.getDay()]} 
    //  ${lesson.start_time / 3600 | 0}:${((lesson.start_time % 3600) / 60 | 0).toString().padStart(2, '0')}
    return `${date.getMonth() + 1}月${date.getDate()}日${lesson.start_time < 43200 ? '上午' : '晚上'}`
}
// 因节假日或其他原因，需要取消原来排定的
// 课程时，可通过将课程的 hidden 
// 字段设置为 1 来隐藏该课程。同时，我
// 们应该以某种方式提前通知该课程的老师
// 和已预约的学员，且在计算费用时，应该
// 排除该课程，我们还应该记录取消该课程
// 的原因。
async function suspendLesson(app, id, status) {
    return new Promise((resolve, reject) => {
        const url = `${app.globalData.host}/yoga/admin/lesson/hidden?id=${id}&status=${status}&openid=${app.globalData.openid
            }`
        wx.request({
            url,
            success(res) {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject();
                }
            },
            fail(error) {
                reject();
            }
        });
    });
}