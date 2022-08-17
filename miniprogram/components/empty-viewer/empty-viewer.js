// "empty-viewer": "../../components/empty-viewer/empty-viewer"
// <empty-viewer></empty-viewer>
Component({
    properties: {
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
            this.triggerEvent('submit', evt.currentTarget.dataset.index)
        },

    }
})