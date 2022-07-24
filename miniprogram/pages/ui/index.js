 const app = getApp()


 const formatNumber = n => {
   n = n.toString()
   return n[1] ? n : '0' + n
 }
 Page({
   data: {
     userInfo: {},
     hasUserInfo: false,
     canIUse: wx.canIUse('button.open-type.getUserInfo'),
     awardsList: {},
     animationData: {},
     btnDisabled: '',
     btnCount: 0,
     info: '',
     time: '',
     // 概率设置
     rateA: 0.60,
     rateB: 0.20,
     rateC: 0.10,
     rateD: 0.06,
     rateE: 0.03,
     rateF: 0.01,
     btnShow: true,
     infoShow: 0
   },
   // 事件处理函数
   bindViewTap: function () {
     wx.navigateTo({
       url: '../list/list'
     })
   },
   onShareAppMessage() {
     return {
       title: "转盘"
     }
   },
   
   onLoad: function () {
     // this.getLocations()
     // if(wx.getStorageSync('btnCount')){
     //   this.setData({
     //     infoShow: wx.getStorageSync('btnCount')
     //   })
     // }
     // if (app.globalData.userInfo) {
     //   this.setData({
     //     userInfo: app.globalData.userInfo,
     //     hasUserInfo: true
     //   })
     // } else if (this.data.canIUse){
     //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
     //   // 所以此处加入 callback 以防止这种情况
     //   app.userInfoReadyCallback = res => {
     //     this.setData({
     //       userInfo: res.userInfo,
     //       hasUserInfo: true
     //     })
     //   }
     // } else {
     //   // 在没有 open-type=getUserInfo 版本的兼容处理
     //   wx.getUserInfo({
     //     success: res => {
     //       app.globalData.userInfo = res.userInfo
     //       this.setData({
     //         userInfo: res.userInfo,
     //         hasUserInfo: true
     //       })
     //     }
     //   })

     // }
   },
   getUserInfo: function (e) {
     console.log(e)
     app.globalData.userInfo = e.detail.userInfo
     this.setData({
       userInfo: e.detail.userInfo,
       hasUserInfo: true
     })
   },
   gotoList: function () {
     // 若要跳转至tabBar中的页面，可以使用wx.switchTab方式
     wx.switchTab({
       url: '../list/list'
     })
   },
   probability: function () {
     let year
     let month
     let day
     let hour
     let minute
     let second
     let formatTime = date => {
       year = date.getFullYear()
       month = date.getMonth() + 1
       day = date.getDate()
       hour = date.getHours()
       minute = date.getMinutes()
       second = date.getSeconds()
       return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
     }


     const formatNumber = n => {
       n = n.toString()
       return n[1] ? n : '0' + n
     }

     this.setData({
       time: formatTime(new Date())
     })
     let randomNumb = Math.random()
     if (randomNumb >= 0 && randomNumb <= this.data.rateA) {
       return 0
     } else if (randomNumb >= this.data.rateA && randomNumb <= this.data.rateA + this.data.rateB) {
       return 1
     } else if (randomNumb >= this.data.rateA + this.data.rateB && randomNumb <= this.data.rateA + this.data.rateB + this.data.rateC) {
       return 2
     } else if (randomNumb >= this.data.rateA + this.data.rateB + this.data.rateC && randomNumb <= this.data.rateA + this.data.rateB + this.data.rateC + this.data.rateD) {
       return 3
     } else if (randomNumb >= this.data.rateA + this.data.rateB + this.data.rateC + this.data.rateD && randomNumb <= this.data.rateA + this.data.rateB + this.data.rateC + this.data.rateD + this.data.rateE) {
       return 4
     } else if (randomNumb >= this.data.rateA + this.data.rateB + this.data.rateC + this.data.rateD && randomNumb <= this.data.rateA + this.data.rateB + this.data.rateC + this.data.rateD + this.data.rateE + this.data.rateF) {
       return 5
     }
   },
   getLottery: function () {
     this.probability()
     if (wx.getStorageSync('btnCount')) {
       wx.setStorageSync('btnCount', wx.getStorageSync('btnCount') + 1)
     } else {
       wx.setStorageSync('btnCount', this.data.btnCount++)
     }
     var that = this
     // 生成一个0~6之间的随机小数 >>> 取整数 0 ~ 5
     // var awardIndex = Math.random() * 6 >>> 0;
     var awardIndex = this.probability()
     // 获取奖品配置
     var awardsConfig = app.awardsConfig,
       runNum = 8
     if (wx.getStorageSync('btnCount') === 4) {
       wx.setStorageSync('btnShow', false)
       this.setData({
         infoShow: wx.getStorageSync('btnCount')
       })
       // awardsConfig.chance = false
     }
     // 初始化 rotate
     /*  var animationInit = wx.createAnimation({
         duration: 10
       })
       this.animationInit = animationInit;
       animationInit.rotate(0).step()
       this.setData({
         animationData: animationInit.export(),
         btnDisabled: 'disabled'
       })*/

     // 旋转抽奖
     app.runDegs = app.runDegs || 0
     // console.log('deg', app.runDegs)
     app.runDegs = app.runDegs + (360 - app.runDegs % 360) + (360 * runNum - awardIndex * (360 / 6))
     // console.log('deg', app.runDegs)

     var animationRun = wx.createAnimation({
       duration: 4000,
       timingFunction: 'ease'
     })
     that.animationRun = animationRun
     animationRun.rotate(app.runDegs).step()
     that.setData({
       animationData: animationRun.export(),
       btnDisabled: 'disabled'
     })

     // 记录奖品
     var winAwards = wx.getStorageSync('winAwards') || {
       data: []
     }
     winAwards.data.push(this.data.time + ": 获得" + awardsConfig.awards[awardIndex].name + '1个')
     wx.setStorageSync('winAwards', winAwards)
     let names = ''
     if (app.globalData.userInfo) {
       names = app.globalData.userInfo.nickName
     }

     // 中奖提示
     setTimeout(function () {
       wx.showModal({
         title: '恭喜',
         content: '恭喜' + names + '获得' + (awardsConfig.awards[awardIndex].name),
         showCancel: false
       })
       that.setData({
         btnDisabled: ''
       })
     }, 4000);


     /*wx.request({
       url: '../../data/getLottery.json',
       data: {},
       header: {
           'Content-Type': 'application/json'
       },
       success: function(data) {
         console.log(data)
       },
       fail: function(error) {
         console.log(error)
         wx.showModal({
           title: '抱歉',
           content: '网络异常，请重试',
           showCancel: false
         })
       }
     })*/
   },
   // 生命周期 监听页面初次渲染完成
   onShow: function (e) {
     var that = this;

     // getAwardsConfig
     app.awardsConfig = {
       // chance: true,
       awards: [{
           'index': 0,
           'name': '1元'
         },
         {
           'index': 1,
           'name': '10元'
         },
         {
           'index': 2,
           'name': '100元'
         },
         {
           'index': 3,
           'name': '1000元'
         },
         {
           'index': 4,
           'name': '10000元'
         },
         {
           'index': 5,
           'name': '1000000元'
         }
       ]
     }
     // console.log('wx.getStorageSync(btnShow)1', wx.getStorageSync('btnShow'))

     // wx.setStorageSync('awardsConfig', JSON.stringify(awardsConfig))
     // if(wx.getStorageSync('btnShow') === false){
     //   wx.setStorageSync('btnShow', wx.getStorageSync('btnShow'))
     // } else {
     //   wx.setStorageSync('btnShow', true)
     // }
     console.log(this)
     // 绘制转盘
     var awardsConfig = app.awardsConfig.awards,
       len = awardsConfig.length,
       rotateDeg = 360 / len / 2 + 90,
       html = [],
       turnNum = 1 / len // 文字旋转 turn 值
     // that.setData({
     //   btnDisabled: wx.getStorageSync('btnShow') ? '' : 'disabled'  
     // })
     var ctx = wx.createContext()
     for (var i = 0; i < len; i++) {
       // 保存当前状态
       ctx.save();
       // 开始一条新路径
       ctx.beginPath();
       // 位移到圆心，下面需要围绕圆心旋转
       ctx.translate(150, 150);
       // 从(0, 0)坐标开始定义一条新的子路径
       ctx.moveTo(0, 0);
       // 旋转弧度,需将角度转换为弧度,使用 degrees * Math.PI/180 公式进行计算。
       ctx.rotate((360 / len * i - rotateDeg) * Math.PI / 180);
       // 绘制圆弧
       ctx.arc(0, 0, 150, 0, 2 * Math.PI / len, false);

       // 颜色间隔
       if (i % 2 == 0) {
         ctx.setFillStyle('rgba(255,184,32,.1)');
       } else {
         ctx.setFillStyle('rgba(255,203,63,.1)');
       }

       // 填充扇形
       ctx.fill();
       // 绘制边框
       ctx.setLineWidth(0.5);
       ctx.setStrokeStyle('rgba(228,55,14,.1)');
       ctx.stroke();

       // 恢复前一个状态
       ctx.restore();

       // 奖项列表
       html.push({
         turn: i * turnNum + 'turn',
         lineTurn: i * turnNum + turnNum / 2 + 'turn',
         award: awardsConfig[i].name
       });
     }
     that.setData({
       awardsList: html
     });

     // 对 canvas 支持度太差，换种方式实现
     /*wx.drawCanvas({
       canvasId: 'lotteryCanvas',
       actions: ctx.getActions()
     })*/

   }
 })