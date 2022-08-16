// "list-item": "../../components/list-item/list-item"
// <list-item></list-item>
Component({
    properties: {
        thumbnail: String,
        classType: String,
        subhead: String,
        head: String,
        second: String,
        three: String
    },
    data: {
        app: getApp()
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
            this.swipeBorder();
            this.triggerEvent('submit', evt.currentTarget.dataset.index)
        },

    }
})