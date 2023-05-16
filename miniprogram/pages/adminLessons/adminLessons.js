const app = getApp();
const shared = require('../../utils/shared')
import init, {
    query_lessons
} from "../../pkg/admin";

Page({
    data: {
        app,
        selected: 0,
        indexs: ["今天", "明天", "近七日", "近半月"]
    },
    async onLoad() {
        await init();
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        this.data.start = date.getTime() / 1000;
        this.data.end = this.data.start + 86400;
        this.loadData();
    },
    async loadData() {

        await query_lessons(this, app.globalData.host, this.data.start, this.data.end,
            await app.getOpenId());
        console.log(this.data);
    },
    onIndex(e) {
        const selected = e.currentTarget.dataset.id;
        this.setData({
            selected
        })
        if (selected === 0) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            this.data.start = date.getTime() / 1000;
            this.data.end = this.data.start + 86400;
            this.loadData();
        } else if (selected === 1) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            this.data.start = date.getTime() / 1000 + 86400;
            this.data.end = this.data.start + 86400;
            this.loadData();
        } else if (selected === 2) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            this.data.start = date.getTime() / 1000;
            this.data.end = this.data.start + 7 * 86400;
            this.loadData();
        } else if (selected === 3) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            this.data.start = date.getTime() / 1000;
            this.data.end = this.data.start + 14 * 86400;
            this.loadData();
        }
    },
    navigate(e) {
        shared.navigate(e)
    },
});
