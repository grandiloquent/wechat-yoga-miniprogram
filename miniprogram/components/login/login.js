const app = getApp();

Component({
	/*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
{
  "usingComponents": {
    "login":"../../components/login/login"
  }
}
    */
	properties: {},
	data: {
		app
	},
	methods: {
		async updateUserInfo(e) {
			const user = await getUserProfileAsync();
			// const userCode = await loginAsync();
			// const id = await requestAysnc(`https://api.weixin.qq.com/sns/jscode2session?appid=${app.globalData.appId}&secret=${app.globalData.appSecret}&js_code=${userCode}&grant_type=authorization_code`);
			wx.request({
				url: `${app.globalData.host}/api/user`,
				method: 'POST',
				data: {
					nick_name: user.userInfo.nickName,
					avatar_url: user.userInfo.avatarUrl,
					open_id: app.globalData.openid
				},
				success: res => {
					this.triggerEvent('success', user.userInfo)
				},
				fail: err => {
					this.triggerEvent('fail', err);
				}
			})

			// wx.getUserProfile({
			//   lang: 'zh_CN',
			//   desc: '用于完善会员资料',
			//   success: response => {
			//     const {
			//       nickName,
			//       avatarUrl,
			//     } = response.userInfo;
			//     console.log(response)
			//     shared.post(this, 'user/1', {
			//       nickName,
			//       avatarUrl,
			//       openId: app.globalData.openid,
			//     }, data => {
			//       this.triggerEvent('success', response.userInfo)
			//     })
			//   },
			//   fail: error => {
			//     console.log(error)
			//     this.triggerEvent('fail', error);
			//   }
			// })
		}
	}
})

function loginAsync() {
	return new Promise((resolve, reject) => {
		wx.login({
			success: res => {
				if (res.code) {
					resolve(res.code);
				} else {
					reject()
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

function getUserProfileAsync() {
	return new Promise((resolve, reject) => {
		wx.getUserProfile({
			lang: 'zh_CN',
			desc: '用于完善会员资料',
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}

function requestAysnc(url) {
	return new Promise((resolve, reject) => {
		wx.request({
			url,
			success: res => {
				resolve(res)
			},
			fail: err => {
				reject(err)
			}
		})
	})
}