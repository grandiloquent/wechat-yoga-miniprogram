const app = getApp();

Page({
    data: {
        app,
        selected: 0,
        indexs: ["今天", "明天", "近七日", "近半月"]
    },
    async onLoad() {
    },
    onIndex(e) {
        const selected = e.currentTarget.dataset.id;
        this.setData({
            selected
        })
    }
});