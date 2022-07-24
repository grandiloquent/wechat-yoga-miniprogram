const app = getApp()
Page({
	onPreviewImage(e) {
		wx.previewImage({
			current: e.detail,
			urls: this.data.pictruesLeft.map(x => x.src)
				.concat(this.data.pictruesRight.map(x => x.src))
		})
	},
	data: {
		pictruesLeft: [],
		pictruesRight: [],
		leftHeight: 0,
		rightHeight: 0,
		limit: 20,
		offset: 0,
		app
	},
	async onLoad(options) {
		/*
		Load basic configuration
		*/
		if (!app.globalData.configs) {
			app.globalData.ready = () => {
				this.setData({
					app
				})
			}
		}
		/*
		 */
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		/*
		https://developers.weixin.qq.com/miniprogram/en/dev/api/base/system/system-info/wx.getSystemInfoSync.html
 		*/
		const systemInformation = wx.getSystemInfoSync();
		this.setData({
			screenWidth: systemInformation.screenWidth,
			screenHeight: systemInformation.screenHeight,
			imgWidth: calculatePictureMaximumVisibleSize(systemInformation),
		})
		await this.loadPictures();
	},
	async loadPictures() {
		/*========================================*/
		let res;
		try {
			res = await loadPictures(this.data.offset , this.data.limit);
		} catch (error) {
			wx.showToast({
				title: '无法加载数据',
				icon: 'error'
			});
			console.error(error);
		}
		if (!res) {
			this.data.finished = true;
			return;
		}
		/*========================================*/
		if (!res.length) {
			this.data.finished = true;
			return;
		}
		this.setData({
			length: res.length
		});
		res.forEach(x => {
			const match = /W(\d+)H(\d+)/.exec(x.url);
			const width = parseInt(match[1]);
			const height = parseInt(match[2]);
			var scale = this.data.imgWidth / width;
			var imgHeight = height * scale;
			if (this.data.leftHeight <= this.data.rightHeight) {
				this.data.pictruesLeft.push({
					id: x.id,
					src: `${app.globalData.staticHost}/images/${x.url}`,
					width: this.data.imgWidth,
					height: imgHeight
				})
				this.data.leftHeight += imgHeight;
			} else {
				this.data.pictruesRight.push({
					id: x.id,
					src: `${app.globalData.staticHost}/images/${x.url}`,
					width: this.data.imgWidth,
					height: imgHeight
				})
				this.data.rightHeight += imgHeight;
			}
		})
		this.setData({
			pictruesLeft: this.data.pictruesLeft,
			pictruesRight: this.data.pictruesRight
		})
	},
	async onReachBottom() {
		try {
			if (this.data.finished) return;
			this.data.offset += this.data.limit;
			await this.loadPictures();
		} catch (error) {
			this.data.finished = true;
		}
	},
	onShareAppMessage() {
		return {
			title: '照片墙'
		}
	},
})
function calculatePictureMaximumVisibleSize(systemInformation) {
	return 0.5 * (systemInformation.screenWidth - systemInformation.screenWidth / 750 * 16 * 3);
}
function loadPictures(offset,limit) {
	return new Promise((resolve, reject) => {
		wx.request({
			url: `${app.globalData.host}/api/picture?mode=1&offset=${offset}&limit=${limit}`,
			success: res => {
				resolve(res.data)
			},
			fail: err => {
				reject(err)
			}
		})
	});
}