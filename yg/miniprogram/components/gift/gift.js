// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "gift":"../../components/gift/gift"
// <gift app="{{app}}"></gift>
Component({
  properties: {
    slogan: String,
    app: Object
  },
  methods: {
    onClick(evt) { 
      this.triggerEvent('submit')
    }
  }
})
