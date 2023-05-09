import init, { beijing_time, lunar_time, get_weather, bind_index, bind_booking, get_open_id } from "../pkg/weixin";

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
        console.log(baseUri, start, openid, classType);
        await bind_booking(baseUri, start, openid, classType, page)
    }

    async getOpenId(baseUri) {
        await get_open_id(baseUri);
    }
}
const shared = new Shared();

module.exports = shared;