// "item": "../../components/item/item"
// <item></item>
Component({
    properties: {
        thumbnail: String,
        subhead: String,
        head: String,
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
            this.triggerEvent('head')
        },
        onBook(e) {
            this.triggerEvent('book')
        },
        onUnBook(e) {
            this.triggerEvent('unbook')
        },
        onUnWait(e) {
            this.triggerEvent('unwait')
        }
    }
})