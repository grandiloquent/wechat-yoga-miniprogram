const app = getApp();
const bookLesson = require('../appointment/bookLesson');
const deleteAppointment = require('../appointment/deleteAppointment');
const setCourseStatus = require('../appointment/setCourseStatus');

Page({
	data: {
		active: false,
		app,
		selectedIndex: 1,
		type: 4
	},
	album(e) {
		wx.previewImage({
			current: e.currentTarget.dataset.src,
			urls: this.data.coach.pictures
				.map(x => `${app.globalData.staticHost}/images/${x}`)
		})
	},
	async book(e) {
		await bookLesson(this, app, e);
	},
	handleDeleteAppointment(e) {
		deleteAppointment(this, app, e);
	},
	handleTap(e) {
		const index = parseInt(e.currentTarget.dataset.index);
		this.setData({
			selectedIndex: index
		});
		let type = 2;
		if (index === 1) {
			type = 4;
		} else if (index === 2) {
			type = 1;
		}
		this.data.type = type;
		this.loadData();
	},
	call() {
		wx.makePhoneCall({
			phoneNumber: this.data.coach.phoneNumber || '15348313821'
		})
	},
	jumpIntro() {
		wx.navigateTo({
			url: `/pages/intro/intro?id=${this.data.id}`
		})
	},
	onLesson(e) {
		const id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: `/pages/lesson/lesson?id=${id}`
		})
	},
	loadData() {
		let now = new Date();
		now.setHours(0, 0, 0, 0);
		wx.request({
			url: `${app.globalData.host}/api/coach?mode=3&id=${this.data.id}&openId=${app.globalData.openid}&startTime=${now.getTime()/1000}&endTime=${now.getTime()/1000+86400 * 7}&classType=${this.data.type}`,
			success: res => {
				if (res.statusCode === 200) {
					if (!res.data.lessons) {
						this.data.coach.lessons = [];
						this.setData({
							coach: this.data.coach
						})
						return;
					}
					setCourseStatus(app, res.data.lessons)
					res.data.lessons.sort((x, y) => {
						const dif = x.date_time - y.date_time;
						if (dif != 0) {
							return dif;
						} else {
							return x.start_time - y.start_time
						}
					});
					this.setData({
						coach: res.data
					})
				} else {
					wx.showToast({
						title: "网络不稳定",
						icon: "error"
					})
				}
			},
			fail: err => {
				wx.showToast({
					title: "网络不稳定",
					icon: "error"
				});
			}
		});
	},
	async onLoad(options) {
		app.globalData.ready = () => {
			this.setData({
				app
			})
		}
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// 教练的ID
		this.data.id = options.id || 6;
		this.loadData();
	},
	onShareAppMessage() {
		return {
			title: '私教'
		}
	},
	async onSign(e) {

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
	onSubmitData() {
		wx.navigateTo({
			url: '/pages/vipList',
		})
	},
	onSuccess(res) {
		app.globalData.userInfo = res.detail;
		this.setData({
			showLogin: false,
			user: res.detail
		})
	},
	previewCover() {
		wx.previewImage({
			urls: [
				`${app.globalData.staticHost}/images/${this.data.teacher.thumbnail}`
			]
		})
	}
})