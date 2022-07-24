Component({
  /*
    https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/
,"vip":"../../components/vip/vip"
<vip></vip>
<vip title="{{title}}" subtitle="{{subtitle}}" content="{{content}}" footer="{{footer}}"></vip>

    */
  properties: {
    title: String,
    subtitle: {
      type: String,
      value: '有效期'
    },

    content: String,
    footer: String
  },
  data: {},
  methods: {

  }
});