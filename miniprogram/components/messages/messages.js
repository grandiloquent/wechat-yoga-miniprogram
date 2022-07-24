Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
{
  "usingComponents": {
    "messages":"../../components/messages/messages"
  }
}
<messages></messages>
    */
  properties: {
    titleModal: {
      type: String,
      value: '信息'
    },
    active: {
      type: Boolean,
      value: true,
    },
    message: {
      type: String,
      value: ""
    }
  },
  data: {},
  methods: {
    async onSubmitData(e) {
      this.setData({
        active: false
      });
      this.triggerEvent('submitData');
    },
    /*
    bind:submitData="onSubmitData"
    onSubmitData(e){
    console.log(e.detail);
  },
    */
    onCloseModal(e) {
      this.setData({
        active: false,
      });
      // capture-bind:closeModal="onCloseModal"
      this.triggerEvent('closeModal', this.data.selectedIndex);
    },
    /*
    onCloseModal(e){
    console.log(e.detail);
  },
    */
  },
})