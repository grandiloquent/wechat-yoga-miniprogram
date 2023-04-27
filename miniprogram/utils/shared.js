function checkUpdate() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/base/update/UpdateManager.html
    const updateManager = wx.getUpdateManager();
    return new Promise((resolve, reject) => {
        updateManager.onCheckForUpdate(function (res) {
            if (!res.hasUpdate) {
                resolve();
            }
        });
        updateManager.onUpdateReady(() => {
            // https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        updateManager.applyUpdate()
                        reject()
                    } else {
                        resolve()
                    }
                },
                fail: () => {
                    resolve()
                }
            });
        });
    });


}
module.exports = {
    checkUpdate,
};