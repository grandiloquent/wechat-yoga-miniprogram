import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomCards extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`
  .wrapper {
  padding: 0 16px;
}
.item {
  border-top: 1px solid #e8eaed;
  display: block;
  padding: 12px 0;
  display: flex;
}

.left {
  flex-grow: 1;
}

.image {
  border: none;
  border-radius: 8px;
  object-fit: cover;
  align-self: end;
  margin-left: 16px;
  height: 92px;
  width: 92px;
}

.top {
  -webkit-box-orient: horizontal;
  flex-direction: row;
  color: #5f6368;
  display: flex;
  flex-wrap: wrap;
  letter-spacing: .01428571em;
  font-family: Roboto, Arial, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}

.top-left {
  font-weight: 500;
display:none;
}

.top-left:after {
  content: "\\0000a0\\002022\\0000a0";
  padding-right: 8px;
  padding-left: 6px;
}

.top-right {
  display: inline-flex;
}

                      .bottom {
  letter-spacing: .00625em;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  color: #202124;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  padding-top: 8px;
}`;
  constructor() {
    super();
    this.data = [];
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    window.location = `./card?id=${index}`
  }
  render() {
    return html` <div class="wrapper">
${this.data.map((element, index) => {
      console.log(element);
      return html`<div class="item" data-index="${element.id}" @click="${this.navigate}">
  <div class="left">
    <div class="top">
      <div class="top-left">

      </div>
      <div class="top-right">
${timeAgo(element.creation_time * 1000)}
      </div>
    </div>
    <div class="bottom">
${element.title}
    </div>
  </div>
  <img class="image" src=https://static.lucidu.cn/images/${element.thumbnail}>
</div>`;
    })}
  </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-cards', CustomCards);
/*
<!--
<script type="module" src="../components/custom-cards.js"></script>
<custom-cards bind @submit=""></custom-cards>
                                         -->
                                     */


function timeSpan(atime, btime) {
  var milliseconds = +(btime || new Date()) - +atime;
  var seconds = ~~(milliseconds / 1000);
  var minutes = ~~(milliseconds / (1 * 60 * 1000));
  var hours = ~~(milliseconds / (1 * 60 * 60 * 1000));
  var days = ~~(milliseconds / (1 * 24 * 60 * 60 * 1000));
  var years = ~~(days / 365.5);
  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
}

function timeAgo(time, locales = 'zh') {
  const ts = timeSpan(time);
  if (!i18n[locales]) locales = 'zh';
  if (ts.seconds < 60) return i18n[locales].justNow;
  if (ts.minutes < 60) return ts.minutes + ' ' + i18n[locales].minutesAgo;
  if (ts.hours < 24) return ts.hours + ' ' + i18n[locales].hoursAgo;
  if (ts.days < 7) return ts.days + ' ' + i18n[locales].daysAgo;
  if (ts.days < 30) return ~~(ts.days / 7) + ' ' + i18n[locales].weeksAgo;
  if (ts.years < 1) return ~~(ts.days / 30) + ' ' + i18n[locales].monthsAgo;
  return ts.years + ' ' + i18n[locales].yearsAgo;
}

const i18n = {
  zh: {
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    weeksAgo: '周前',
    monthsAgo: '个月前',
    yearsAgo: '年前',
  },
  en: {
    justNow: 'just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    monthsAgo: 'months ago',
    yearsAgo: 'years ago',
  },
};