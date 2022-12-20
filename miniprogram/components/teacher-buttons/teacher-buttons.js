// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "teacher-buttons":"../../components/teacher-buttons/teacher-buttons"
// <teacher-buttons app="{{app}}"></teacher-buttons>


const utils = require('../../utils');

Component({
options: {
    styleIsolation: 'isolated'
  },
  properties: {
    items: {
      type: Array,
    },
    app:Object
  },
  data: {
  },
   lifetimes: {
    async attached() {
     
    },
    detached: function () {
    },
  },
 observers: {
     'items': function (items) {
       this.setData({
         notices: items.map(x => {
           x.timeago = utils.timeago(x.updated_time)
           return x;
         })
       })
     },
   },
  methods: {
   onClick(evt){
      this.triggerEvent('submit')
    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    onTeacherButtonsSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})
