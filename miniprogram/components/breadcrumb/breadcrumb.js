// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "breadcrumb":"../../components/breadcrumb/breadcrumb"
// <breadcrumb app="{{app}}"></breadcrumb>


const utils = require('../../utils');

Component({

  properties: {
    items: {
      type: Array,
    },
    app:Object
  },
  data: {
  },
   
  methods: {
   onClick(evt){
      this.triggerEvent('submit', evt.currentTarget.dataset.id)
    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    onBreadcrumbSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})
