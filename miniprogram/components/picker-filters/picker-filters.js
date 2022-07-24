/*
 "picker-filters": "../../components/picker-filters/picker-filters"
 <picker-filters></picker-filters>
 */
Component({
  properties: {
    selectedTabIndex: {
      type: Number,
      value: 0
    }
  },
  data: {
    items: [
      "今天",
      "明天",
      "后天",
      "大后天",
      "近一周",
      "近一月",
      " 过去一月"
    ]
  },
  methods: {
    onSelectedIndexChange(e) {
      const mode = parseInt(e.currentTarget.dataset.mode);
      let detail;
      if (mode === 0) {
        const leftDate = new Date();
        leftDate.setHours(0, 0, 0, 0)
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: leftDate.getTime(),
        };
      } else if (mode == 1) {
        const leftDate = new Date();
        leftDate.setDate(leftDate.getDate() + 1);
        leftDate.setHours(0, 0, 0, 0)
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: leftDate.getTime(),
        };
      } else if (mode == 2) {
        const leftDate = new Date();
        leftDate.setHours(0, 0, 0, 0);
        leftDate.setDate(leftDate.getDate() + 2);
        const rightDate = new Date(leftDate);
        rightDate.setDate(rightDate.getDate() + 1);
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: leftDate.getTime(),
        };
      } else if (mode == 3) {
        const leftDate = new Date();
        leftDate.setHours(0, 0, 0, 0);
        leftDate.setDate(leftDate.getDate() + 3);
        const rightDate = new Date(leftDate);
        rightDate.setDate(rightDate.getDate() + 1);
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: leftDate.getTime(),
        };
      } else if (mode == 4) {
        const leftDate = new Date();
        leftDate.setHours(0, 0, 0, 0);
        const rightDate = new Date(leftDate);
        rightDate.setDate(rightDate.getDate() + 7);
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: rightDate.getTime(),
        };
      } else if (mode == 5) {
        const leftDate = new Date();
        leftDate.setHours(0, 0, 0, 0);
        const rightDate = new Date(leftDate);
        rightDate.setDate(rightDate.getDate() + 30);
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: rightDate.getTime(),
        };
      } else if (mode == 6) {
        const leftDate = new Date();
        leftDate.setHours(0, 0, 0, 0);
        const rightDate = new Date(leftDate);
        rightDate.setDate(rightDate.getDate());
        leftDate.setDate(leftDate.getDate() - 30);
        detail = {
          leftDate: leftDate.getTime(),
          rightDate: rightDate.getTime(),
        };
      }
      this.triggerEvent('selectedIndexChange', detail);
      // bind:selectedIndexChange="onSelectedIndexChange"
    }
  }
})