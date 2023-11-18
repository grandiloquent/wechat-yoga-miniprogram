const app = getApp();
const shared = require('../../utils/shared')
import init, {
    lessons_and_teachers,
    lessons_update
} from "../../pkg/admin";

Page({
    data: {
        app,
        loaded: false,
        lessonSelectedIndex: 0,
        teacherSelectedIndex: 0,
        weekSelectedIndex: 0,
        classTypeSelectedIndex: 0,
        startTimeSelectedIndex: 0,
        endTimeSelectedIndex: 0,
        peopleSelectedIndex: 0,

    },
    async onLoad(options) {
        wx.setNavigationBarTitle(
            { title: "设置课程" }
        );
        this.data.id = options.id || 1;
        await init();
        await this.loadData();
    },
    async loadData() {
        await lessons_and_teachers(this, app.globalData.host, this.data.id, app.globalData.openid || (await app.getOpenId()));
        this.data.lessons.push("自定义")
        this.setData({
            weeks: "一二三四五六日".split(''),
            classTypes: ["团课", "小班", "私教"],
            startTimes: [...new Array(8).keys()].map(x => `${(540 + x * 90) / 60 | 0}:${((540 + x * 90) % 60).toString().padStart(2, '0')}`),
            endTimes: [...new Array(8).keys()].map(x => `${(600 + x * 90) / 60 | 0}:${((600 + x * 90) % 60).toString().padStart(2, '0')}`),
            peoples: [...new Array(9).keys()].map(x => (8 + x).toString()),
            loaded: true,
            lessons: this.data.lessons
        });
    },
    navigate(e) {
        shared.navigate(e)
    },
    onLesson(e) {
        const name = this.data.lessons[e.currentTarget.dataset.index];
        if (name === "自定义") {
            wx.showModal({
                title: "添加新课程",
                editable: true,
                success: res => {
                    if (res.confirm) {
                        this.data.lessons[
                            this.data.lessons.length - 1
                        ] = res.content;
                        this.data.lessons.push("自定义")
                        this.setData({
                            lessons: this.data.lessons
                        }); 
                    }
                }
            })
        } else {
            this.setData({ lessonSelectedIndex: e.currentTarget.dataset.index });
        }
    },
    onTeacher(e) {
        this.setData({ teacherSelectedIndex: e.currentTarget.dataset.index });
    },
    onWeek(e) {
        this.setData({ weekSelectedIndex: e.currentTarget.dataset.index });
    }, onClassType(e) {
        this.setData({ classTypeSelectedIndex: e.currentTarget.dataset.index });
    }, onStartTime(e) {
        this.setData({
            startTimeSelectedIndex: e.currentTarget.dataset.index,
            endTimeSelectedIndex: e.currentTarget.dataset.index
        });
    }, onEndTime(e) {
        this.setData({ endTimeSelectedIndex: e.currentTarget.dataset.index });
    }, onPeople(e) {
        this.setData({ peopleSelectedIndex: e.currentTarget.dataset.index });
    },
    async onSubmit() {
        let class_type = (
            this.data.classTypes[this.data.classTypeSelectedIndex] === "团课" && 4
        ) || (
                this.data.classTypes[this.data.classTypeSelectedIndex] === "私教" && 2
            ) || (
                this.data.classTypes[this.data.classTypeSelectedIndex] === "小班" && 1
            );
        let start_time = durationToSeconds(this.data.startTimes[this.data.startTimeSelectedIndex]);
        let end_time = durationToSeconds(this.data.endTimes[this.data.endTimeSelectedIndex]);
        let peoples = parseInt(this.data.peoples[this.data.peopleSelectedIndex]);
        let date_time = this.data.weekSelectedIndex === 6 ? 0 : this.data.weekSelectedIndex + 1;
        let lesson = this.data.lessons[this.data.lessonSelectedIndex];
        let teacher = this.data.teachers[this.data.teacherSelectedIndex];
        if (end_time <= start_time) {
            wx.showToast({
                icon: "error",
                title: "下课时间不正确"
            });
            return
        }
        let obj = {
            class_type,
            start_time,
            end_time,
            peoples,
            date_time,
            lesson,
            teacher
        };
        try {
            await lessons_update(app.globalData.host, await app.getOpenId(), JSON.stringify(obj));
        } catch (error) {

        }

        wx.showToast({
            title: "成功"
        });

        wx.switchTab({
            url: "/pages/booking/booking"
        });
    }
});

function durationToSeconds(duration) {
    let result = 0;
    if (/(\d{1,2}:){1,2}\d{1,2}/.test(duration)) {
        const pieces = duration.split(':');
        for (let i = pieces.length - 1; i > -1; i--) {
            result += Math.pow(60, i + 1) * parseInt(pieces[pieces.length - i - 1]);
        }
        return result;
    }
    result = parseInt(duration);
    if (isNaN(result)) {
        result = 0;
    }
    return result;
}