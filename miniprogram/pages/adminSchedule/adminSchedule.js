const app = getApp();
const shared = require('../../utils/shared')


Page({
    data: {
        app,
    },
    // 通过 URL 查询参数获取待查
    // 询的课程标识
    async onLoad(options) {
        this.setData({
            src: `${app.globalData.host}/yoga/admin/schedule`
        })


    },
    onShare() {
        wx.downloadFile({
            url: this.data.src,
            success: (res) => {
                wx.showShareImageMenu({
                    path: res.tempFilePath
                })
            }
        })
    },
    onPreview() {
        wx.previewImage({
            current: this.data.src,
            urls: [this.data.src] 
        })
    },
    onShow() {

    },
});
