Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
{
  "usingComponents": {
    "modal":"../../components/modal/modal"
  }
}
,"modal":"components/modal/modal"
<modal></modal>
    */
  properties: {
    title: String,
    value: {
      type: String,
      value: ''
    },
    active: {
      type: Boolean,
      value: true
    },
    textarea: Boolean,
    textareaPlaceholder: String,
    placeholder: String,
    inputType: {
      type: String,
      value: 'text'
    },
    input: Boolean,
    placeholder1: String,
    inputType1: {
      type: String,
      value: 'text'
    },
    input1: Boolean
  },
  data: {

  },



  methods: {
    onTextareaInput(e) {


      // capture-bind:textareaInput="onTextareaInput"
      this.triggerEvent('textareaInput', e.detail.value);
    },

    /*
    onTextareaInput(e){
    console.log(e.detail);
  },
    */

    onSubmitData(e) {
      this.setData({
        active: false
      });
      // capture-bind:submitData="onSubmitData"
      this.triggerEvent('submitData');
    },

    /*
    onSubmitData(e){
    console.log(e.detail);
  },
    */

    onCloseModal(e) {
      this.setData({
        active: false
      });

      // capture-bind:closeModal="onCloseModal"
      this.triggerEvent('closeModal', this.data.selectedIndex);
    },

    /*
    onCloseModal(e){
    console.log(e.detail);
  },
    */


  }
})