// "item": "../../components/item/item"
// <item></item>
Component({
    properties: {
        thumbnail: String,
        subhead: String,
        head: String,
        id: Number,
        mode: Number
    },
    data: {
        app: getApp()
    },
    pageLifetimes: {
        show() {
        }
    },
    methods: {
        onHeadTap(e) {
            this.triggerEvent('head', e.currentTarget.dataset.id)
        },
        onBook(e) {
            this.triggerEvent('book', e.currentTarget.dataset.id)
        },
        onUnBook(e) {
            this.triggerEvent('unbook', e.currentTarget.dataset.id)
        },
        onUnWait(e) {
            this.triggerEvent('unwait', e.currentTarget.dataset.id)
        }
    }
})