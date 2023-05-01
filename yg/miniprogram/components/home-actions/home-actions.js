// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "home-actions":"../../components/home-actions/home-actions"
// <home-actions app="{{app}}"></home-actions>


Component({
  properties: {
    items: {
      type: Array,
    },
    app: Object
  },
  methods: {
    navigate(evt) {
      this.triggerEvent('submit', evt.currentTarget.dataset.id)
    }
  }
})
