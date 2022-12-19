// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "user-profile":"../../components/user-profile/user-profile"
// <user-profile app="{{app}}"></user-profile>

Component({
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    user: Object,
    backgroundColor: String,
    app: Object
  },
  data: {
  },
  lifetimes: {
    async attached() {

    },
    detached: function () {
    },
  },
  methods: {
    navigate(evt) {
      this.triggerEvent('submit', evt.currentTarget.dataset.id)
    }
  }
})
