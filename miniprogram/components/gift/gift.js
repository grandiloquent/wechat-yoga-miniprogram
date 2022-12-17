// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "gift":"../../components/gift/gift"
// <gift app="{{app}}"></gift>
Component({
  properties: {
    slogan: String,
    app: Object,
    id: String
  },
  methods: {
    onClick(evt) {
      // this.triggerEvent
      console.log(this)
      this.triggerEvent('submit')
    }
  }
})
