const shared = require('shared');

App({

    async onLaunch() {
        getNavigationBarSize(this.globalData)
        checkUpdate();
        await tryLoadOpenId(this.globalData);
        initializeCloud();
        trySaveOpenId(this.globalData)
    },

    globalData: {
        openid: null,
        host: 'https://lucidu.cn',
        staticHost: 'https://static.lucidu.cn',
        configs: null
    },
});

function checkUpdate() {
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
        wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                }
            }
        })
    });
}

function getNavigationBarSize(obj) {
    const {
        screenWidth,
        // 顶部状态细条
        statusBarHeight
    } = wx.getSystemInfoSync();
    // 胶囊按钮
    const {
        height,
        top,
        right
    } = wx.getMenuButtonBoundingClientRect();
    // 左边内边距
    const paddingLeft = screenWidth - right;
    // 顶部减去状态栏的高度再乘以2得到导航栏的高度
    obj.navHeight = (top - statusBarHeight) * 2 + height;
    obj.navTop = statusBarHeight;
    obj.navLeft = paddingLeft
}

function initializeCloud() {
    wx.cloud && wx.cloud.init({
        env: 'cloud1-5gwr0r4t1ffd2b12',
        traceUser: true,
    });
}


async function tryLoadOpenId(obj) {
    try {
        const res = await wx.getStorage({
            key: 'openid'
        });
        if (res.data) {
            obj.openid = res.data;
        }
    } catch (error) {
    }
}
/*
通过云函数免鉴权获取用户标识，
并缓存到本地，
避免重复调用云函数的延迟和性能损耗。
此用户标识并非通用标识，
同一微信的不同小程序的标识都不相同。
此标识不宜作为区别用户身份的唯一标识，
因为如果未来如需迁移数据会十分困难。
*/
function trySaveOpenId(globalData) {
    wx.cloud.callFunction({
        name: "login",
        success: res => {
            globalData.openid = res.result.openid;
            wx.setStorage({
                key: "openid",
                data: res.result.openid
            });
        },
        fail(err) {
            wx.showToast({
                title: '请求失败，请重试',
                icon: 'none'
            })
        }
    });
}