Component({
  properties: {
    imageWidth: Number,
    imageHeight: Number,
    loaded: {
      type: Boolean,
      value: false
    },
    src: {
      type: String,
    }
  },
  data: {

  },
  methods: {

    onTap(e) {
      this.triggerEvent('view', e.currentTarget.dataset.src); // bind:tap="onTap"
    },
    onImageLoaded() {
      this.setData({
        loaded: true
      });
    }
  }
})