// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "teacher-buttons":"../../components/teacher-buttons/teacher-buttons"
// <teacher-buttons app="{{app}}"></teacher-buttons>


const utils = require('../../utils');

Component({

  data: {
    selected: 1
  },


  methods: {
    onClick(evt) {
      const id = parseInt(evt.currentTarget.dataset.id);
      this.setData({
        selected: id
      });
      this.triggerEvent('submit', id)
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