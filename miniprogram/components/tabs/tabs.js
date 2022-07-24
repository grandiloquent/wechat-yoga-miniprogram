Component({
  properties: {
    selectedTabIndex: {
      type: Number,
      value: 0
    }
  },
  data: {},
  methods: {
    onSelectedIndexChange(e) {
      const index = e.currentTarget.dataset.index;
      this.setData({
        selectedTabIndex: index
      });
      this.triggerEvent('selectIndexChanged', index);
      // bind:selectedIndexChange="onSelectedIndexChange"
    },

  }
})