const app = getApp();
const shared = require('../../utils/shared')

Page({
    data: {
        app,
        selected: 0,
        indexs: ["今天", "明天", "近七日", "近半月"]
    },
    async onLoad(options) {
        this.data.id = options.id || 1271;
        this.loadData();
    },
    async loadData() {
        const lesson = await
            new Promise((resolve, reject) => {
                const url = `${app.globalData.host}/yoga/admin/lesson?id=${this.data.id}&openid=${app.globalData.openid}`
                wx.request({
                    url,
                    success(res) {
                        resolve(res.data);
                    },
                    fail(error) {
                        reject();
                    }
                });
            });
        lesson.date = formatLessonDateTime(lesson);
        this.setData({
            lesson
        })
    },
    onShow() {
        this.setData({
            background: shared.getRandomColor()
        })
    }
});
function formatLessonDateTime(lesson) {
    const date = new Date(lesson.date_time * 1000);
    //  周${'日一二三四五六'[date.getDay()]} 
    //  ${lesson.start_time / 3600 | 0}:${((lesson.start_time % 3600) / 60 | 0).toString().padStart(2, '0')}
    return `${date.getMonth() + 1}月${date.getDate()}日${lesson.start_time < 43200 ? '上午' : '晚上'}`
}