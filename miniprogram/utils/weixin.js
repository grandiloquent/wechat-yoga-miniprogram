import init, {
    beijing_time, lunar_time,
    get_weather, bind_index, bind_booking, get_open_id, book,
    user_query, unbook
} from "../pkg/weixin";

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
        await book(baseUri, id, openid);
    }
    async unbook(baseUri, id, openid) {
        await unbook(baseUri, id, openid);
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
            result = await user_query(app.globalData.host, app.globalData.openid);
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