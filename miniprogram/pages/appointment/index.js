const app = getApp(); 
const deleteAppointment = require('/deleteAppointment');
const bookLesson = require('/bookLesson');
const request = require('../../request');
const setCourseStatus = require('/setCourseStatus');

Page({
	onSelectedIndexChanged(e) {
		if (e.detail === 1) {
			const dates = getDates(this, 7);
			this.setData({
				dates,
				selectedDateTime: dates[0].time * 1000,
				selected: 0
			});
			this.loadData();
		} else {
			const dates = getDates(this);
			this.setData({
				dates,
				selectedDateTime: dates[this.data.todayIndex].time * 1000,
				selected: this.data.todayIndex
			});
			this.loadData();
		}
	},
	onSelectIndexChanged(e) {
		if (e.detail == 1) {
			wx.navigateTo({
				url: `/pages/private/private`
			})
		}
	},
	data: {
		active: false,
		selectedDateTime: 0,
		app,
	},
	handleDeleteAppointment(e) {
		deleteAppointment(this,app, e);
	},
	async book(e) {
		await bookLesson(this, app, e);
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
	async onLoad(options) {
		if (!app.globalData.configs) {
			app.globalData.ready = () => {
				this.setData({
					app
				})
			}
		}
		this.setData({
			dates: getDates(this), // 设置星期一到日
		})
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
	},
	onShareAppMessage() {
		return {
			title: '晨蕴瑜伽日课表'
		}
	},
	onShow() {
		this.loadData();
	},

	loadData() {
		const startTime = this.data.selectedDateTime / 1000;

		request.reservations(app.globalData.host, '1', 0, app.globalData.openid, startTime, 0, 4, res => {
			if (!res) {
				this.setData({
					courses: []
				});
				return;
			}
			setCourseStatus(app, res);
			this.setData({
				//loading: false,
				courses: res.sort((x, y) => {
					const dif = x.date_time - y.date_time;
					if (dif != 0) {
						return dif;
					} else {
						return x.start_time - y.start_time
					}
				})
			});
		});
		/*
		shared.execute(this, 'reservation/2', [
		  'dateTime',
		  this.data.selectedDateTime / 1000,
		  'classType',
		  4
		], data => {
		  if (!data) {
		    this.setData({
		      courses: []
		    });
		    return;
		  }
		  setLessonStatus(res.data.lessons,
		  	(app.globalData.configs && app.globalData.configs.close_booked) || 3,
		  	(app.globalData.configs && app.globalData.configs.close_book) || 60);

		})
		*/
	},

	onSuccess(res) {
		app.globalData.userInfo = res.detail;
		this.setData({
			showLogin: false,
			user: res.detail
		})
	},
	async tapDate(e) {
		this.setData({
			// Switch to selected date
			selected: parseInt(e.currentTarget.dataset.id),
			selectedDateTime: new Date(e.currentTarget.dataset.time * 1000).setHours(0, 0, 0, 0)
		});
		// Load selected date course data
		// The date is appended to each control's dataset property
		this.loadData();
	},
	onLesson(e) {
		const id = e.currentTarget.dataset.id
		wx.navigateTo({
			url: `/pages/lesson/lesson?id=${id}`
		})
	},
	onPositive() {
		wx.makePhoneCall({
			phoneNumber: '18711104317'
		})
	},
})


function getDates(page, offset = 0) {
	const dates = [];
	const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
	let today = new Date();
	today.setHours(0, 0, 0, 0);

	let todayDateTimestamp = today.getTime();
	let start = calculateStartTimestamp(todayDateTimestamp, today.getDay());
	for (let index = 0; index < 7; index++) {
		const timestamp = new Date((start + 86400 * (index + offset)) * 1000);
		if (todayDateTimestamp === timestamp.getTime()) {
			page.setData({
				selected: index,
				todayIndex: index,
				selectedDateTime: timestamp.getTime()
			});
		}
		dates.push({
			id: index,
			week: todayDateTimestamp === timestamp.getTime() ? '今日' : weeks[timestamp.getDay()],
			day: timestamp.getDate(),
			month: timestamp.getMonth(),
			time: timestamp / 1000
		})
	}
	return dates;
}

function calculateStartTimestamp(dateTimestamp, day) {

	if (day === 0) {
		return dateTimestamp / 1000 - 86400 * 6;
	} else {
		return dateTimestamp / 1000 - 86400 * (day - 1);
	}
}