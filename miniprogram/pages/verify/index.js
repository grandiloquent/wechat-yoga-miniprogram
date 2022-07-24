// pages/user/index.js
const app = getApp();

Page({
    data: {
        codeText: '获取验证码',
        checkPassPlaceholder: app.globalData.pass && app.globalData.pass.checkPassPlaceholder
    },
    async code(e) {


        if (!this.data.counting &&
            this.data.verifyActive === 'active') {
            this.start();
            let response = await api.code(app, this.data.phoneNumber);
            let count = 60;
            this.setData({
                codeText: `${count--}秒后重试`
            })
            const interval = setInterval(() => {
                this.setData({
                    codeText: `${count--}秒后重试`
                })
                if (count < 1) {
                    clearInterval(interval);
                    this.release();
                }
            }, 1000);
        }
    },
    release() {
        this.data.counting = false;
        this.setData({
            verifyActive: 'active',
            codeText: '获取验证码',
        });
    },
    start() {
        this.data.counting = true;
        this.setData({
            verifyActive: ''
        });
    },
    closeVerify() {
        this.setData({
            showVerify: false
        });
        wx.switchTab({
            url: `/pages/${this.data.page}/index`,
        });
    },
    inputPhone(e) {
        if (/^\d{11}$/.test(e.detail.value)) {
            this.setData({
                verifyActive: 'active',
                phoneNumber: e.detail.value
            })
        }
    },

    async onLoad(options) {
        this.data.page = options.page;
        this.setData({
            showVerify: true
        })
    },
    async verify() {
        if (this.data.btnActive !== 'active') return;
        const res = await api.codeStatus(app, this.data.phoneNumber, this.data.codeNumber);
        if (!res.data) {
            wx.showToast({
                title: "验证码错误",
                icon: 'error'
            })
        } else {
            this.data.userStatus = true;
            this.setData({
                showVerify: false
            });
            wx.switchTab({
                url: `/pages/${this.data.page}/index`,
            });
        }
    },
    inputCode(e) {
        if (/^\d{6}$/.test(e.detail.value) && /^\d{11}$/.test(this.data.phoneNumber)) {
            this.setData({
                btnActive: 'active',
                codeNumber: e.detail.value
            })
        }
    },
})