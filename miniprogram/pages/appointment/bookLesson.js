// const bookLesson =require('/bookLesson');
const login = require('/login');

module.exports = async (page, app, e) => {

	if (!(await login(app, page))) {
		return
	}
	wx.request({
		url: `${app.globalData.host}/api/reservation?id=${e.currentTarget.dataset.id}&userId=${app.globalData.userInfo.id}`,
		success: res => {
			const data = res.data;
			if (data === -100) {
				page.setData({
					isShow: true,
					message: '暂时无法为您服务'
				})
				return;
			} else if (data === -101) {
				page.setData({
					isShow: true,
					message: '课程已满额'
				})
				return;
			} else if (data === -105) {
				page.setData({
					isShow: true,
					message: '请您购买会员卡'
				})
				return;
			}
			page.loadData();
		},
		fail: err => {

		}
	})

}