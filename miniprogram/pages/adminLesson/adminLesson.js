const app = getApp();
const shared = require('../../utils/shared')

Page({
    data: {
        app,
        selected: 0,
        indexs: ["今天", "明天", "近七日", "近半月"]
    },
    async onLoad(options) {
        const id = options.id || 1271;
        console.log(id);
    }
});