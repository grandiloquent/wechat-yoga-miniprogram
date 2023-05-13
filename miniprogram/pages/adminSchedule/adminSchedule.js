const app = getApp();

Page({
    data: {
        app,
    },
    async onLoad() {
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
});
