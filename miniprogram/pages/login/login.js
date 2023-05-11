const utils = require('../../utils')
const app = getApp();
const shared = require('../../utils/shared')
import init, {
    user_query
} from "../../pkg/weixin";
Page({
    data: {
        app,
    },
    async onLoad() {
        wx.setNavigationBarTitle({
            title: app.globalData.title
        });
        await init();
        const isUserProtected = isUserInfoProtected();
        if (isUserProtected) {
            this.setData({
                isUserProtected
            })
            if (!app.globalData.userId) {
                try {
                    const openid = app.globalData.openid || (await app.getOpenId());
                    if (openid) {
                        const res = await user_query(app.globalData.host, openid);
                        app.globalData.userId = res;
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            if (app.globalData.userId) {
                this.setData({
                    avatarUrl: app.globalData.userId.avatar_url,
                    nickName: app.globalData.userId.nick_name
                })
            }

        }
    },
    async updateUserInfo(e) {
        try {
            const response = await shared.getUserProfile();
            console.log(response);
        }
        catch { }
    },
    onChooseAvatar(e) {
        // `${app.globalData.host}/yoga/picture`
        let url = `${app.globalData.host}/yoga/avatar`;

        let { avatarUrl } = e.detail
        wx.uploadFile({
            url, //仅为示例，非真实的接口地址
            filePath: avatarUrl,
            name: 'images',
            success: res => {
                this.setData({
                    avatarUrl: `${app.globalData.host}/images/${res.data}`,
                })
            }
        });
    },
});

function isUserInfoProtected() {
    return compareVersion(wx.getSystemInfoSync().SDKVersion, "2.27.1") >= 0
}
// 通过比较微信基础库版本号，用于解决兼容性问题
function compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)
    while (v1.length < len) {
        v1.push('0')
    }
    while (v2.length < len) {
        v2.push('0')
    }
    for (let i = 0; i < len; i++) {
        const num1 = parseInt(v1[i])
        const num2 = parseInt(v2[i])
        if (num1 > num2) {
            return 1
        } else if (num1 < num2) {
            return -1
        }
    }
    return 0
}
// 异步获取用户昵称头像等信息
// 特定版本的基础库已关闭该接口。调用后将统一返回一致的头像和名为微信用户的昵称
// 使用该方法时必须考虑兼容性
function getUserProfile() {
    // https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            lang: 'zh_CN',
            desc: '用于完善会员资料',
            success: response => {
                resolve(response)
            },
            fail: error => {
                reject(error)
            }
        });
    })
}