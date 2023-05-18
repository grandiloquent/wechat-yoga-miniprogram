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
    async onLoad() {
        wx.setNavigationBarTitle(
            { title: "会员列表" }
        );
        await init();
        await this.loadData();
    },
    async loadData() {
        await users_all(this, app.globalData.host, await app.getOpenId());
    },
    navigate(e) {
        shared.navigate(e)
    }
});