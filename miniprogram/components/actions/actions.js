// "actions": "../../components/actions/actions"
// <actions></actions>
Component({
    properties: {
        selected: {
            type: Number,
            value: 0
        }
    },
    data: {
        items: ["今天", "明天", "一周内"]
    },
    pageLifetimes: {
        show() {
        }
    },
    methods: {
        onTap(evt) {
            this.setData({
                selected: parseInt(evt.currentTarget.dataset.index)
            })
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