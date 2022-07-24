const app = getApp()

Page({

	data: {
		app
	},
	async onLoad(options) {
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
    });
		renderPromotions(this);

	},
	onShareAppMessage() {
		return {
			title: '优惠活动'
		}
	},

})
async function renderPromotions(page) {
	// renderPromotions(this);
	page.setData({
		market: app.globalData.configs.market
	})
}