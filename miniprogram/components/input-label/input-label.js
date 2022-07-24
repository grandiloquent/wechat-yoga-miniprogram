Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
,"input-label":"../../components/input-label/input-label"
<input-label></input-label>
selected:String,
inputValue:String,
title:String,
disabled:String,
textarea:String,
inputType:String,
inputValue:String,
inputType:String,
inputValue:String,
               wx:for="{{}}" wx:key="*this" selected = "{{selected}}"
inputValue = "{{inputValue}}"
title = "{{title}}"

textarea = "{{textarea}}"
inputType = "{{inputType}}"
inputValue = "{{inputValue}}"
inputType = "{{inputType}}"
inputValue = "{{inputValue}}"
<input-label inputType = "number" disabled = "{{true}}" inputValue = "{{inputValue}}" "title = "发卡日期"></input-label>

<input-label inputValue="{{teacher.name}}" title="姓名"
  data-key="name"
  bind:changed="onInputChanged"></input-label>

  <input-label textarea = "{{true}}" inputValue="{{teacher.description}}" title="描述" data-key="description" bind:changed="onInputChanged"></input-label>



  onInputChanged(e) {
    if (!this.data.body) {
      this.data.body = {};
    }
    Object.assign(this.data.body, {
      [e.currentTarget.dataset.key]: e.detail
    });
  },

  <picker bindchange="bindTeacherTypeChange" range="{{teacherTypes}}">
    <input-label disabled="{{true}}" inputValue="{{teacher.type}}" title="类型" data-key="type" bind:changed="onInputChanged"></input-label>
  </picker>

  bindTeacherTypeChange(e) {
    const index = parseInt(e.detail.value);
    const teacher = this.data.teacher || {};
    teacher.type = this.data.teacherTypes[index];
    this.data.body.type = teacher.type;
    this.setData({
      teacher
    });
    console.log(this.data)
  },
    */
  properties: {
    title: String,
    inputValue: {
      type: String,
      value: ''
    },
    inputType: {
      type: String,
      value: 'text'
    },
    textarea: Boolean,
    disabled: {
      type: Boolean,
      value: false
    },
    maxlength:Number
  },
  data: {},






  methods: {
    onBlur(e) {
      this.setData({
        selected: false
      });
    },

    /*
    onBlur(e){
    console.log(e.detail);
  },
    */




    onClick(e) {
      // this.setData({
      //   selectedIndex: e.currentTarget.dataset.index
      // });

      // // capture-bind:click="onClick"
      // this.triggerEvent('click', this.data.selectedIndex);
      this.setData({
        selected: true
      });
    },

    /*
    onClick(e){
    console.log(e.detail);
  },
    */
    onInput(e) {
      // bind:changed="onClick"
      this.triggerEvent("changed", e.detail.value);
      this.setData({
        inputValue: e.detail.value
      });
    },



  }
})
