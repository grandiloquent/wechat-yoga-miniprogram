const app = getApp();
const shared = require('../../utils/shared')
import init, {
    users_all
} from "../../pkg/admin";

Page({
    data: {
        app,
        loaded: false
    },
    async onLoad(options) {
        this.data.id = options.id || 1;
        await init();
        await this.loadData();
    },
    async loadData() {
        // const id = this.data.id;
        // const now = new Date();
        // now.setHours(0, 0, 0, 0);
        // const start = now.getTime() / 1000;
        // const end = start + 86400 * 7;
        // const openId = await app.getOpenId();
        // await user_lessons(this, app.globalData.host, id, start, end, openId);
        await users_all(this, app.globalData.host, await app.getOpenId());

    },
    navigate(e) {
        shared.navigate(e)
    }
});