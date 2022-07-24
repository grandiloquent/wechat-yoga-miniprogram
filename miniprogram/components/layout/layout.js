Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
{
  "usingComponents": {
    "layout":"../../../components/layout/layout"
  }
}

<layout active= "{{activeLayout}}" titleModal = "{{titleLayout}}" bind:submitData="onSubmitData">
</layout>
titleModal="添加会员卡"
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
    autoClose: {
      type: Boolean,
      value: true
    }
  },
  data: {},
  methods: {
    async onSubmitData(e) {
      if (this.data.autoClose) {
        this.setData({
          active: false
        });
      }

      this.triggerEvent('submitData');
      // bind:submitData="onSubmitData"
    },
    /*
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