const app = getApp();
Page({
	data: {
		app
	},
	onLoad(options) {
		// Load basic configuration parameters
		if (!app.globalData.configs) {
			app.globalData.ready = () => {
				this.setData({
					app
				})
			}
		}
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		wx.request({
			url: `${app.globalData.host}/api/coach?mode=4&id=${options.id}`,
			success: res => {
				this.setData({
					intro: res.data
				})
			}
		})

	},
	onShareAppMessage() {
		return {
			title: this.data.intro.name
		}
	},

})