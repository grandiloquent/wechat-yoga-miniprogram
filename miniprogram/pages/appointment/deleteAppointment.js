// const deleteAppointment =require('/deleteAppointment');

module.exports = (page, app,e) => {
	wx.showModal({
		title: '询问',
		content: '您确定要取消预约吗？',
		success: async res => {
			if (res.confirm) {
				wx.request({
					url: `${app.globalData.host}/api/reservation?mode=3&id=${e.currentTarget.dataset.reservationid}`,
					//method:'POST',
					//data,
					success: res => {
            page.loadData();
					},
					fail: err => {
						//reject(err)
					}
				})

			}
		}
	})
}