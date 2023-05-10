import init, { beijing_time, lunar_time, get_weather, bind_index, bind_booking, get_open_id, book } from "../pkg/weixin";

class Shared {
    constructor() {
        (async () => {
            await init();
        })();
    }
    lunarTime() {
        return lunar_time();
    }
    async getWeather() {
        return await get_weather();
    }
    async beijingTime() {
        return await beijing_time();
    }
    async bindIndex(baseUri, page) {
        await bind_index(baseUri, page)
    }
    async bindBooking(baseUri, start, openid, classType, page) {
        await bind_booking(baseUri, start, openid, classType, page)
    }

    async getOpenId(baseUri) {
        await get_open_id(baseUri);
    }
    async book(baseUri, id, openid) {
        console.log(baseUri, id, openid);
        await book(baseUri, id, openid);
    }
    async checkUserAvailability(app) {
        if (!app.globalData.openid) {
            return false;
        }
        if (app.globalData.userId) {
            return true;
        }
        let result;
        try {
            result = await getStringAsync(app, "v1/user?action=2");
            //TODO: check
            if (!result || !result.nick_name) {
                return false;
            }
            app.globalData.userId = result;
            return true;
        } catch (error) {
            return false;
        }
    }


}
const shared = new Shared();

module.exports = shared;