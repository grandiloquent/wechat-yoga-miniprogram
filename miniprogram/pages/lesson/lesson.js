const app = getApp();

const SECONDS_IN_TIME = [
	1, // 1 second
	60, // 1 minute
	3600, // 1 hour
	86400, // 1 day
	604800, // 1 week
	2419200, // 1 month
	29030400 // 1 year
];

/*
 * The language array to which <convert> defaults.
 */
const en_US = [
	"刚刚", "秒之前",
	"1分钟之前", "分钟之前",
	"1小时之前", "小时之前",
	"1天之前", "天之前",
	"1周之前", "周之前",
	"1月之前", "月之前",
	"1年之前", "年之前"
]


function convert(el, timestamp, lang) {

	let now = Math.floor(new Date / 1000);
	let diff = (now - timestamp) || 1; // prevent undefined val when diff == 0

	for (let i = 6; i >= 0; i--) {

		if (diff >= SECONDS_IN_TIME[i]) {

			let time_elapsed = Math.floor(diff / SECONDS_IN_TIME[i]);
			let adverbs = en_US;
			let sentence = adverbs.map((el, idx) => idx % 2 == 0 ? el : time_elapsed + " " + el);

			return time_elapsed >= 2 ? sentence[i * 2 + 1] : sentence[i * 2];

		}

	}

}

Page({

	onPreviewPhoto(e) {
		wx.previewImage({
			current: `${app.globalData.staticHost}/images/${e.currentTarget.dataset.src}`,
			urls: this.data.lesson.photos.map(x => `${app.globalData.staticHost}/images/${x}`)
		})
	},
	onTextareaInput(e) {
		this.data.content = e.detail;
	},
	onExpandDescription(e) {
		this.setData({
			expand: !this.data.expand
		});
	},
	data: {
		app,
		showModal: false,
		expand: false
	},

	onHideModal() {
		this.setData({
			showModal: false
		});
	},
	onInput(e) {
		this.data.content = e.detail.value;
	},
	async onSubmitData() {
		const obj = {};

		obj.course_id = this.data.id;
		obj.user_id = app.globalData.userInfo.id;
		obj.content = this.data.content;

      console.log(obj);
		try {
			const res = await new Promise((resolve, reject) => {
				wx.request({
					url: `${app.globalData.host}/api/comments`,
					method: 'POST',
					data: obj,
					success: res => {
						if (res.statusCode === 200)
							resolve(res.data);
						else
							reject(res.statusCode)
					},
					fail: err => {
						reject(err);
					}
				});
			});
			this.setData({
				showModal: false
			});
			this.loadComments();
		} catch (error) {
			wx.showToast({
				title: "无法加载数据",
				icon: 'error'
			})
		}
	},
	onShowModal() {
		this.setData({
			showModal: true
		});
	},
	onSuccess(res) {
		app.globalData.userInfo = res.detail;
		this.setData({
			showLogin: false,
			user: res.detail
		})
	},
	async onLoad(options) {
		this.data.id = options.id || 360;
		if (!(await login(app, this))) {
			return
		}
		this.initialize();
		
		wx.request({
			url: `${app.globalData.host}/api/reservation?mode=5&id=${this.data.id}`,

			success: res => {
				this.setData({
					lesson: res.data
				});
			}
		});
      this.loadComments();
	},

	loadComments() {
		wx.request({
			url: `${app.globalData.host}/api/comments?mode=1`,
			//method:'POST',
			//data,
			success: res => {
				//resolve(res)
              if(!res.data)return;
				this.setData({
					comments: res.data.map(x => {
						x.ago = convert(null, x.update_at )

						return x;
					})
				})
			}
		})

	},
	initialize() {
		this.data.title = '课程';

		wx.setNavigationBarTitle({
			title: this.data.title
		});
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
	},
	onShareAppMessage() {
		return {
			title: this.data.title
		}
	},
	onBookLesson(e) {
		shared.execute(this, 'reservation/1', [
			'id', this.data.id
		], data => {
			this.loadData();
		});
	}
});

function isLessonExpired(lesson) {
	let now = new Date();
	const timeInMinutes = now.getHours() * 60 * 60 + now.getMinutes() * 60;
	now.setHours(0, 0, 0, 0);
	return now.getTime() / 1000 > lesson.dateTime || ((now.getTime() / 1000 === lesson.dateTime) && timeInMinutes >= startTime)
}