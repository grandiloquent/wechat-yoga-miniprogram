// components/dialog/dialog.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: {
            type: String
        },
        message: {
            type: String
        },
        isShow: {
            type: Boolean,
        },
        positive: {
            type: String,
            value:"确定"
        },
        negative: {
            type: String,
            value:"取消"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onPositive() {
            this.setData({
                isShow: false
            })
            this.triggerEvent('onPositive');
        },
        onNegative(){
            this.setData({
                isShow: false
            })
        },
        close(){
            this.setData({
                isShow: false
            })
        }

    }
})