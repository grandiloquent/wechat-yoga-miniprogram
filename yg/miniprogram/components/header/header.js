// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "header":"../../components/header/header"
// <header app="{{app}}"></header>


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
    onHeaderSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})