// "custom-textarea": "../../components/custom-textarea/custom-textarea"
// <custom-textarea></custom-textarea>
Component({
    properties: {
        title: String,
        placeholder: String,
        maxlength: {
            type: Number,
            value: -1
        },
        show: {
            type: Boolean,
            value: false,
            observer() {
                if (this.data.show) {
                    this.setData({
                        animateClass: 'dialog-bounce-enter',
                        fadeClass: 'fade-enter-active'
                    });
                    requestAnimationFrame(() => {
                        this.setData({
                            animateClass: '',

                        });
                    })
                } else {
                    this.setData({
                        animateClass: 'dialog-bounce-leave-active',
                        fadeClass: 'fade-leave-active'
                    });
                }
            }
        }
    },
    data: {
        animateClass: 'dialog-bounce-enter',
        fadeClass: 'fade-enter-active'
    },
    pageLifetimes: {
        show() {
        }
    },
    methods: {
        onSubmit(evt) {
            this.setData({
                show: false
            })
            this.triggerEvent('submit');
        },
        onClose(evt) {
            this.setData({
                show: false
            })
            this.triggerEvent('close');
        }
    }
})

function requestAnimationFrame(cb) {
    const systemInfo = getSystemInfoSync();
    if (systemInfo.platform === 'devtools') {
        return setTimeout(() => {
            cb();
        }, 1000 / 30);
    }
    return wx
        .createSelectorQuery()
        .selectViewport()
        .boundingClientRect()
        .exec(() => {
            cb();
        });
}

let systemInfo;

function getSystemInfoSync() {
    if (systemInfo == null) {
        systemInfo = wx.getSystemInfoSync();
    }
    return systemInfo;
}