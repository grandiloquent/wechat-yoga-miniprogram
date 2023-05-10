import init, {
  beijing_time,
  lunar_time,
  get_weather,
  bind_index,
  bind_booking,
  book,
  user_query,
  unbook,
} from "../pkg/weixin";

class Shared {
  constructor() {

  }
  async init() {
    if (this.inited) {
      return
    }
    await init();
    this.inited=true;
  }
  async lunarTime() {
    await this.init();
    return lunar_time();
  }
  async getWeather() {
    await this.init();
    return await get_weather();
  }
  async beijingTime() {
    await this.init();
    return await beijing_time();
  }
  async bindIndex(baseUri, page) {
    await this.init();
    await bind_index(baseUri, page)
  }
  async bindBooking(baseUri, start, openid, classType, page) {
    await this.init();
    await bind_booking(baseUri, start, openid, classType, page)
  }

 
  async book(baseUri, id, openid) {
    await this.init();
    return await book(baseUri, id, openid);
  }
  async unbook(baseUri, id, openid) {
    await this.init();
    return await unbook(baseUri, id, openid);
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