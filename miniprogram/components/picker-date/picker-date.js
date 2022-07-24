/*
"header": "../../components/header/header"
<header></header>
 "picker-date": "../../components/picker-date/picker-date"
 <picker-date bind:left="onLeft" bind:right="onRight"></picker-date>
 async onLeft(e) {
    this.data.leftDate = e.detail;
    await this.loadData();
  },
  async onRight(e) {
    this.data.rightDate = e.detail;
    await this.loadData();
  },
 async onLoad(options) {
    const date = new Date();
    date.setHours(0, 0, 0, 0)
    this.data.leftDate = date;
    this.data.rightDate = new Date(date);
    await this.loadData();
  },
    const startTime = this.data.leftDate.getTime();
      const now = new Date(this.data.rightDate);
      now.setDate(now.getDate() + 1);

      const endTime = now.getTime();
 */
Component({
  properties: {
    rightDate: {
      type: Number,
      observer() {
        const dateString = fomratDateString(new Date(this.data.rightDate));
        this.setData({
          rightDateString: dateString,
        });
      }
    },
    leftDate: {
      type: Number,
      observer() {
        const dateString = fomratDateString(new Date(this.data.leftDate));
        this.setData({
          leftDateString: dateString,
        });
      }
    },
    light: {
      type: Boolean,
      observer() {

      }
    }
  },
  data: {

  },
  lifetimes: {
    attached() {
      if (!this.data.leftDate) {
        const date = new Date();
        date.setHours(0, 0, 0, 0)
        const dateString = fomratDateString(date);
        this.setData({
          leftDateString: dateString,
          rightDateString: dateString
        });
        this.data.rightDate = date;
        this.data.leftDate = new Date(date);
      }
      wx.createSelectorQuery()
        .in(this)
        .select('.text')
        .boundingClientRect(res => {
          console.log("Gets the length of the text box", res.width);
          const width = res.width;
          wx.createSelectorQuery()
            .in(this)
            .select('.label')
            .boundingClientRect(label => {
              console.log("Gets the width of the label", label.width);
              wx.createSelectorQuery()
                .in(this)
                .select('.date-arrow')
                .boundingClientRect(arrow => {
                  if(arrow)
                  this.setData({
                    offset: arrow.width - (width - label.width) / 10
                  });
                }).exec();
            }).exec();
        }).exec();


    }
  },
  methods: {
    bindRightChange(e) {
      const date = parseDate(e.detail.value);
      if (this.data.leftDate > date) {
        wx.showToast({
          title: "日期太小",
          icon: 'error'
        })
        return;
      }
      this.data.rightDate = date.getTime();
      this.setData({
        rightDateString: fomratDateString(date)
      });
      this.triggerEvent('right', this.data.rightDate);
    },
    bindLeftChange(e) {
      const date = parseDate(e.detail.value);
      if (this.data.rightDate < date) {
        wx.showToast({
          title: "日期太小",
          icon: 'error'
        })
        return;
      }
      this.data.leftDate = date.getTime();
      this.setData({
        leftDateString: fomratDateString(date)
      });
      this.triggerEvent('left', this.data.leftDate);
    },

    onLeft(e) {
      const value = parseInt(e.currentTarget.dataset.value);
      if (this.data.leftDate >= this.data.rightDate && value === 1) {
        wx.showToast({
          title: "日期太小",
          icon: 'error'
        })
        return;
      }
      const leftDate = new Date(this.data.leftDate);
      leftDate.setDate(leftDate.getDate() + value);
      this.data.leftDate = leftDate.getTime();
      this.setData({
        leftDateString: fomratDateString(leftDate)
      });
      this.triggerEvent('left', leftDate);
    },
    onRight(e) {
      const value = parseInt(e.currentTarget.dataset.value);
      if (this.data.leftDate >= this.data.rightDate && value === -1) {
        wx.showToast({
          title: "日期太小",
          icon: 'error'
        })
        return;
      }
      const rightDate = new Date(this.data.rightDate);
      rightDate.setDate(rightDate.getDate() + value);
      this.data.rightDate = rightDate.getTime();
      this.setData({
        rightDateString: fomratDateString(rightDate)
      });
      this.triggerEvent('right', rightDate);
    },
  }
})

function fomratDateString(date) {

  const week = getWeek(date);
  return `${date.getMonth()+1}月${date.getDate()}周${week}`;
}

function getWeek(date) {
  let week;
  if (date.getDay() === 0) {
    week = '日';
  }
  if (date.getDay() === 1) {
    week = '一';
  }
  if (date.getDay() === 2) {
    week = '二';
  }
  if (date.getDay() === 3) {
    week = '三';
  }
  if (date.getDay() === 4) {
    week = '四';
  }
  if (date.getDay() === 5) {
    week = '五';
  }
  if (date.getDay() === 6) {
    week = '六';
  }
  return week;
}

function parseDate(string) {
  const match = /(\d{4})[年-](\d{1,2})[月-](\d{1,2})/.exec(string);
  const now = new Date(match[1], parseInt(match[2]) - 1, match[3]);
  return now;
}