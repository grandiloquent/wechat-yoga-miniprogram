const app = getApp()
const calendar = require('../../calendar');
Page({
	data: {
		app
	},
	handleNavigateToBook() {
		wx.switchTab({
			url: '/pages/appointment/index',
		})
	},
	navigateToAnnouncement(e) {
		wx.navigateTo({
			url: `/pages/announcement/index?id=${e.currentTarget.dataset.id}`,
		});
	},
	navigateToBookClass() {
		wx.switchTab({
			url: '/pages/appointment/index',
		})
	},
	navigateToCoach(e) {
		wx.navigateTo({
			url: `/pages/coach/index?id=${e.currentTarget.dataset.id}`,
		})
	},
	navigateToDiscount() {
		wx.navigateTo({
			url: "/pages/discount/index",
		})
	},
onLoad() {
		if (!app.globalData.configs) {
			app.globalData.ready = () => {
				this.setData({
					app
				})
			}
		}
		const t = new Date();
		this.setData({
			date: calendar.solar2lunar(t.getFullYear(), t.getMonth() + 1, t.getDate())
		});
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		})
		wx.request({
			url: `${app.globalData.host}/api/coach?mode=1`,
			success: res => {
				if (res.statusCode === 200) {
					this.setData({
						coaches: res.data.sort(() => Math.random() - 0.5)
					})
				}
			}
		});
		wx.request({
			url: `${app.globalData.host}/api/notice?mode=1`,
			success: res => {
				if (res.statusCode === 200) {
					this.setData({
						announcements: res.data
					})
				}
			}
		});
		wx.request({
			url: `${app.globalData.host}/api/reservation?mode=4`,
			//method:'POST',
			//data,
			success: res => {
			this.setData({
            prompts:res.data
            })
			},
			fail: err => {
				//reject(err)
			}
		})
	},
	onShareAppMessage() {
		return {
			title: '瑜伽约课工具'
		};
	},
	onShow() {
		wx.request({
			url: "https://wis.qq.com/weather/common?source=xw&refer=h5&weather_type=observe&province=%E6%B9%96%E5%8D%97%E7%9C%81&city=%E9%95%BF%E6%B2%99%E5%B8%82",
			success: res => {
				if (res.statusCode === 200) {
					this.setData({
						weather: res.data.data.observe
					})
				}
			}
		});
		wx.request({
			url: "https://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp",
			success: res => {
				if (res.statusCode === 200) {
					this.data.time = parseInt(res.data.data.t);
					clearInterval(this.data.timer);
					const n = new Date(this.data.time);
					this.setData({
						bj: `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`
					});
					this.data.timer = setInterval(() => {
						this.data.time += 1000;
						const n = new Date(this.data.time);
						this.setData({
							bj: `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`
						});
					}, 1000);
				}
			}
		});
	},
});
