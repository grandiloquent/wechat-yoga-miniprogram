// https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
// "booking-bar":"../../components/booking-bar/booking-bar"
// <booking-bar app="{{app}}"></booking-bar>
const shared = require('../../utils/shared')

Component({
  properties: {
    selected: Number,
    app: Object
  },
  data: {},
  lifetimes: {
    async attached() {
      const {
        navigationHeight,
        navigationTop,
        paddingLeft,
        height
      } = shared.getNavigationBarSize();
      this.setData({
        navigationHeight,
        top: `${navigationTop}px`,
        paddingLeft,
        height
      })
    },
    detached: function () { },
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
    onClick(evt) {
      if (evt.currentTarget.dataset.id === "1") {
        this.setData({
          selected: 0
        });
      } else {
        this.setData({
          selected: 1
        });
      }
      this.triggerEvent('submit', evt.currentTarget.dataset.id)
    }
    /*
   bindtap="navigate"
   navigate(evt) {
         this.triggerEvent('submit', evt.currentTarget.dataset.id)
       }
    onBookingBarSubmit(evt) {
        console.log(evt.detail)
      }
    */
  }
})