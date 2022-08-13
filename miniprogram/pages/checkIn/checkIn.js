const app = getApp()
const deleteAppointment = require('../appointment/deleteAppointment');
const login = require('../appointment/login');
const setCourseStatus = require('../appointment/setCourseStatus');

Page({

    data: {
        active: false,
        app,
    },

    async loadData() {
        const startTime = this.data.leftDate / 1000;
        const now = new Date(this.data.rightDate);
        now.setDate(now.getDate() + 1);
        const endTime = now.getTime() / 1000;
        wx.request({
            url: `${app.globalData.host}/api/reservation?mode=2&startTime=${startTime}&endTime=${endTime}&classType=4&userId=${app.globalData.userInfo.id}`,
            //method:'POST',
            //data,
            success: res => {
                const data = res.data;
                if (!data) {
                    this.setData({
                        courses: []
                    });
                    return;
                }

                setCourseStatus(app, data);
                this.setData({
                    courses: data.sort((x, y) => {
                        const dif = x.dateTime - y.dateTime;
                        if (dif != 0) {
                            return dif;
                        } else {
                            return x.startTime - y.startTime
                        }
                    })
                });
            },
            fail: err => {
                //reject(err)
            }
        })
        /*shared.execute(this, 'reservation/8', [
          'startTime', startTime / 1000,
          'classType', 5,
          'endTime', endTime / 1000
        ], data => {
          if (!data) {
            this.setData({
              courses: []
            });
            return;
          }
          const courses = data;
          setLessonStatus(courses,
            (app.security && app.security.closeBooked) || 3,
            (app.security && app.security.closeBook) || 60)
          this.setData({
            //loading: false,
            courses: courses.sort((x, y) => {
              const dif = x.dateTime - y.dateTime;
              if (dif != 0) {
                return dif;
              } else {
                return x.startTime - y.startTime
              }
            })
          });
        });*/
    },
    makeAppointment() {
        wx.switchTab({
            url: '/pages/appointment/index',
        })
    },
    onFinish(e) {
    },
    async onLeft(e) {
        this.data.leftDate = e.detail;
        await this.loadData();
    },
    onLesson(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/lesson/lesson?id=${id}`
        })
    },
    async onLoad(options) {
        const date = new Date();
        date.setHours(0, 0, 0, 0)
        this.data.leftDate = date.getTime();
        this.data.rightDate = this.data.leftDate;

    },
    async onRight(e) {
        this.data.rightDate = e.detail;
        await this.loadData();
    },
    async onSelectedIndexChange(e) {
        this.setData({
            ...e.detail
        });
        this.loadData();
    },
    onSelectIndexChanged(e) {
        if (e.detail == 0 || e.detail == 2) {
            wx.switchTab({
                url: `/pages/appointment/index`
            })
        }
    },
    async onShow() {
        if (!app.globalData.configs) {
            app.globalData.ready = () => {
                this.setData({
                    app
                })
            }
        }
        if (!(await login(app, this))) {
            return
        }
        this.loadData();
    },
    onSign(e) {
        const sha256 = require('../../sha256');
        const qr = require('../../weapp-qrcode');
        this.setData({
            active: true,
            image: qr.drawImg(`token=${sha256(JSON.stringify({
                userOpenId: app.globalData.openid,
                reservedId: e.currentTarget.dataset.reservedid
            }))}&reservedId=${e.currentTarget.dataset.reservedid}`, {
                typeNumber: 4,
                errorCorrectLevel: 'M',
                size: 500
            })
        })
    },
    handleDeleteAppointment(e) {
        deleteAppointment(this, e);
    },
    onSuccess(res) {
        app.globalData.userInfo = res.detail;
        this.setData({
            showLogin: false,
        })
    }
})