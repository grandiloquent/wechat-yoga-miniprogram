const shared = require('../../shared');
const app = getApp();
Page({
  data: {
    app,
  },
  onLoad(options) {
    this.data.id = options.id || 499;
    shared.execute(this, "vipCard/2", [
      "userId", this.data.id
    ], data => {
      this.setData({
        "vipCards": data
      })
      console.log(data)
    });
  }
})