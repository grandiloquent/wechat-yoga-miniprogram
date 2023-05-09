import init, { beijing_time, lunar_time, get_weather, bind_index } from "../pkg/weixin";

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

}
const shared = new Shared();

module.exports = shared;