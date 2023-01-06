import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomLessonItems extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.wrapper{padding:16px;gap:16px;display:flex;flex-direction:column;}.item{border-radius:8px;display:flex;border:1px solid #dadce0;overflow:hidden;}.item.shadow{box-shadow:0 1px 6px 0 rgba(0,0,0,.16);}.img{border:none;display:inline-block;border-radius:8px 0 0 8px;flex:0 0 auto;height:130px;width:130px;}.right{background-color:#fff;display:flex;flex-direction:column;padding:12px 16px 10px;width:calc(100% - 100px - 16px*2);}.title{font-weight:400;font-size:16px;line-height:20px;letter-spacing:.1px;color:#202124;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 0 2px 0;}.subtitle-wrapper{font-weight:400;font-size:12px;line-height:16px;letter-spacing:.3px;color:#70757a;}.subtitle{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.subtitle:last-child{padding:2px 0;}.label{align-items:center;display:flex;gap:4px;margin-top:auto;}.label-left{font-weight:400;font-size:12px;line-height:16px;letter-spacing:.3px;color:#70757a;padding:2px 0;}.label-right{font-weight:500;font-size:14px;line-height:20px;letter-spacing:.25px;color:#202124;margin-left:auto;}`;
  constructor() {
    super();
    this.data = [];
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="wrapper">
  ${this.data.length ? this.data.map((element, index) => {
      console.log(element);
      return html`<div class="item">
    <img class="img" src=${element.avatar_url}>
    <div class="right">
      <div class="title">${element.nick_name}</div>
      <div class="subtitle-wrapper">
        <div class="subtitle">
          周琼
        </div>
        <div class="subtitle" style="display:none"></div>
      </div>
      <div class="label">
        <div class="label-left">
          你好
        </div>
        <div class="label-right">删除</div>
      </div>
    </div>
  </div>
</div>`;
    }) : html`<div style="display:flex;align-items: center;justify-content: center;flex-direction: column;height:30vh;font-size: 14px;">没有找到相关预约</div>`}</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-lesson-items', CustomLessonItems);
/*
<!--
<script type="module" src="../components/custom-lesson-items.js"></script>
<custom-lesson-items bind @submit=""></custom-lesson-items>
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