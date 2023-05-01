import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUserProfile extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.text {
  font-size: 14px;
  line-height: 16px;
  color: rgb(15, 20, 25);
  font-weight: 700;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.sub-text {
  color: rgb(83, 100, 113);
  margin: 0 20px 0 0;
  font-weight: 400;
}

.banner {
  background-color: rgb(207, 217, 222);
  padding-bottom: 33.3333%;
}

.content {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  margin-bottom: 16px;
}

.top {
  display: flex;
  flex-direction: row;
  -webkit-box-align: start;
  align-items: flex-start;
  -webkit-box-pack: justify;
  justify-content: space-between;
  flex-wrap: wrap;
}

.avatar {
  display: block;
  overflow: visible;
  height: auto;
  margin-bottom: 12px;
  margin-top: -15%;
  min-width: 48px;
  width: 25%;
  position: relative;
}

.avatar>img {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: rgb(0 0 0 / 3%) 0px 0px 2px inset;
}

.button {
  padding: 0 16px;
  margin-bottom: 12px;
  border: 1px solid rgb(207, 217, 222);
  font-size: 15px;
  line-height: 20px;
  min-height: 36px;
  min-width: 36px;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.info {
  margin: 4px 0 12px;
}

.nick-name {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: rgb(15, 20, 25);
  font-size: 20px;
  line-height: 24px;
  font-weight: 800;
}

.subtitle {
  margin-bottom: 12px;
}`;
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
    return html`<div class="banner"></div>
<div class="content">
  <div class="top">
    <div class="avatar">
      <div style="padding-bottom:100%"></div><img style="" src=${this.data.avatar_url}>
    </div>
    <div class="button">会员卡</div>
  </div>
  <div class="info">
    <div class="nick-name">${this.data.nick_name}</div>
  </div>
<div class="subtitle">
${timeAgo(this.data.creation_time*1000)}
</div>
<div>
<span class="text">${this.data.booked}</span> 
<span class="text sub-text">
约课
</span> 
<span class="text">
${this.data.cards}
</span> 
<span class="text sub-text">
会员卡
</span> 
</div> 
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-user-profile', CustomUserProfile);
/*
<!--
<script type="module" src="../components/custom-user-profile.js"></script>
<custom-user-profile bind @submit=""></custom-user-profile>
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