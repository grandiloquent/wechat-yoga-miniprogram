// "tabs": "../../components/tabs/tabs"
// <tabs></tabs>
Component({
    properties: {
        selected: {
            type: Number,
            value: 0,
            observer() {
                this.swipeBorder();
            }
        }
    },
    data: {
        weeks: [
            '周一',
            '周二',
            '周三',
            '周四',
            '周五',
            '周六',
            '周日'
        ]
    },
    pageLifetimes: {
        show() {
            this.swipeBorder();
        }
    },
    methods: {
        onTap(evt) {
            this.setData({
                selected: parseInt(evt.currentTarget.dataset.index)
            })
            this.swipeBorder();
            this.triggerEvent('submit', evt.currentTarget.dataset.index)
        },
        swipeBorder() {
            this.createSelectorQuery().select('.active').boundingClientRect().exec(res => {
                this.setData({
                    width: `width:${res[0].width}px;`,
                    left: `left:${res[0].left}px;`
                })
            })
        }
    }
})