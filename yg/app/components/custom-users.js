import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUsers extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.wrapper{
padding:0 16px;
}`;

  constructor() {
    super();
  }

  _tap(evt) {
    evt.stopPropagation();

    const index = evt.currentTarget.dataset.index;
    console.log(evt);
    window.location = `./user?id=${index}`;
  }
  render() {

    return html`
<div class="wrapper">
${this.data .map((element,index)=>{
element.timeago=timeAgo(element.lasted*1000)
return html`<custom-user-item .data="${element}" data-index=${element.id} @click=${this._tap}></custom-user-item>`;
}) }
</div>
`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.data = [];
  }
}
customElements.define('custom-users', CustomUsers);
/*
<!--
<script type="module" src="./components/custom-users.js"></script>
<custom-users></custom-users>
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