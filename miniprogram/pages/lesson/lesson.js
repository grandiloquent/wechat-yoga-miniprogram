const app = getApp();
const shared = require('../../shared');

const SECONDS_IN_TIME = [
    1, // 1 second
    60, // 1 minute
    3600, // 1 hour
    86400, // 1 day
    604800, // 1 week
    2419200, // 1 month
    29030400 // 1 year
];

/*
 * The language array to which <convert> defaults.
 */
const en_US = [
    "刚刚", "秒之前",
    "1分钟之前", "分钟之前",
    "1小时之前", "小时之前",
    "1天之前", "天之前",
    "1周之前", "周之前",
    "1月之前", "月之前",
    "1年之前", "年之前"
]


function convert(el, timestamp, lang) {

    let now = Math.floor(new Date / 1000);
    let diff = (now - timestamp) || 1; // prevent undefined val when diff == 0

    for (let i = 6; i >= 0; i--) {

        if (diff >= SECONDS_IN_TIME[i]) {

            let time_elapsed = Math.floor(diff / SECONDS_IN_TIME[i]);
            let adverbs = en_US;
            let sentence = adverbs.map((el, idx) => idx % 2 == 0 ? el : time_elapsed + " " + el);

            return time_elapsed >= 2 ? sentence[i * 2 + 1] : sentence[i * 2];

        }

    }

}

Page({
    data: {
        app,
        show: false,
        expand: false
    },
    async initialize() {
        wx.request({
            url: `${app.globalData.host}/api/accessRecords?path=${encodeURIComponent('/pages/lesson/lesson')}`
        })
        try {
            await shared.fetchToken(app);
        } catch (e) {
            this.setData({
                showLogin: true
            });
            return
        }
        await this.loadData()
    },
    async loadData() {
        let res;
        try {
            res = await fetch(app, this.data.id);
            this.setData({
                lesson: makeSubhead(res)
            })
            console.log(res)
        } catch (e) {
            console.error(e)
        }
    },
    async onBook(evt) {

        await shared.book(app, this.data.id, async () => {
            await this.loadData()
        })
    },
    onExpand() {
        this.setData({
            expanded: !this.data.expanded
        })
    },
    async onLoad(options) {
        this.data.id = options.id || 397;
        shared.applyBasicSettings();
        if (!app.globalData.configs) {
            shared.loadSettings(app.globalData.host, (data) => {
                app.globalData.configs = data;
                this.setData({
                    app
                })
                this.initialize();
            })
            return
        }
        this.initialize();
    },
    async onLoginSuccess(res) {
        this.setData({
            showLogin: false
        });
        await this.initialize(this.data.id)
    },
    onPreviewPhotos(e) {
        const item = `${app.globalData.staticHost}/images/${e.currentTarget.dataset.src}`;
        const items = this.data.lesson.photos.map(x => `${app.globalData.staticHost}/images/${x}`);
        if (items.indexOf(item) === -1) {
            items.unshift(item)
        }
        wx.previewImage({
            current: item,
            urls: items
        })
    },
    onShareAppMessage() {
        return {
            title: this.data.title
        }
    },
    async onUnBook(evt) {
        const id = evt.currentTarget.dataset.id;
        wx.showModal({
            title: '您确定要取消预约吗？',
            success: async res => {
                if (res.confirm) {
                    await shared.unBook(app, id, async () => {
                        await this.loadData()
                    });
                }
            }
        })
    },
    onInsertComment(evt) {
        const id = evt.currentTarget.dataset.id;

        this.setData({
            show: true
        })
    }

});

function isLessonExpired(lesson) {
    let now = new Date();
    const timeInMinutes = now.getHours() * 60 * 60 + now.getMinutes() * 60;
    now.setHours(0, 0, 0, 0);
    return now.getTime() / 1000 > lesson.date_time || ((now.getTime() / 1000 === lesson.date_time) && timeInMinutes >= lesson.start_time)
}

function fetch(app, id) {
    /*
    let res;
            try {
                res =await insertBook(app)
            } catch (e) {
                console.error(e)
            }
            */
    return new Promise(((resolve, reject) => {
        wx.request({
            url: `${app.globalData.host}/api/admin.lesson.teacher.query?userId=${app.globalData.userInfo.id}&id=${id}`,
            header: {
                token: app.globalData.token
            },
            success: res => {
                resolve(res.data);
            },
            fail: err => {
                reject(err)
            }
        })
    }))
}

function makeSubhead(lesson) {
    const t = new Date(lesson.date_time * 1000);
    lesson.expired = isLessonExpired(lesson);
    lesson.subhead = `${t.getMonth() + 1}月${t.getDate()}周${'日一二三四五六'[t.getDay()]} ${shared.secondsToDuration(lesson.start_time)}-${shared.secondsToDuration(lesson.end_time)}`;
    return lesson;
}