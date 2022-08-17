// "empty-viewer": "../../components/empty-viewer/empty-viewer"
// <empty-viewer></empty-viewer>
Component({
    properties: {
        selected: {
            type: Number,
            value: 0
        }
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
            this.triggerEvent('submit', evt.currentTarget.dataset.index)
        },

    }
})