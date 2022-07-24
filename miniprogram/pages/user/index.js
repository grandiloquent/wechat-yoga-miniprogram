const shared = require('../../shared');
const app = getApp();

Page({
  data: {
    app
  },

  async onShow() {
    this.setData({
      backgroundColor: shared.getRandomColor(),
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
    if (!app.globalData.configs) {
            app.globalData.ready = () => {
                this.setData({
                    app
                })
            }
        }
    if (!app.globalData.userInfo) {
    	try {
    		const res = await new Promise((resolve, reject) => {
    			wx.request({
    				url: `${app.globalData.host}/api/user?mode=2&openId=${app.globalData.openid}`,
    				success: res => {
    					if (res.statusCode == 404) {
    						reject();
    					} else {
    						resolve(res)
    					}
    				},
    				fail: err => {
    					reject(err);
    				}
    			});
    		});
    		app.globalData.userInfo = res.data;
    	} catch (error) {
    		
    		this.setData({
    			showLogin: true
    		});
    		return;
    	}
    }
    if (!app.globalData.userInfo || !app.globalData.userInfo.nick_name) {
      this.setData({
        showLogin: true
      })
      return;
    } else {
      this.setData({
        user: app.globalData.userInfo
      });
    }
    shared.execute(this, 'reservation/5', [], data => {
      if (data)
        this.setData({
          public: data.filter(x => x.classType === 4)[0].count
        })
    });
  },
  onPrivateTeacherCourse(e) {
    wx.navigateTo({
      url: "/pages/coaches/index"
    })
  },
  onGroupCourses(e) {
    wx.switchTab({
      url: '/pages/appointment/index'
    })
  },
  navigateTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.src
    })
  },

  onShowFeedback(e) {
    this.setData({
      feedbackActive: true
    });
  },
  onShowHistory() {
    wx.navigateTo({
      url: '/pages/lessons/lessons'
    })
  },
  onShowVipList() {
    wx.navigateTo({
      url: '/pages/userVipList/userVipList'
    })
  },
  onMemberPhysicalExamination(e) {
    wx.navigateTo({
      url: `/pages/physicalExamination/physicalExamination`
    });
  }

})