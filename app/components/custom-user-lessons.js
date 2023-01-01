import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUserLessons extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.wrapper {
  max-width: 1024px;
  margin: -4px auto 0;
  position: relative;
  padding: 0 16px 16px 16px;
}

.item {
  border-top: 1px solid #e8eaed;
  display: block;
  padding: 12px 0;
}

.item-wrapper {
  display: flex;
  -webkit-box-orient: horizontal;
  flex-direction: row;
}

.left {
  flex-grow: 1;
}

.right {
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
}

.top-left:after {
  content: "\\0000a0\\002022\\0000a0";
  padding-right: 8px;
  padding-left: 6px
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
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="wrapper">
${this.data .map((element,index)=>{
const dateString=new Date(element.date_time*1000);
return html`<div class="item" data-index="${index}">
  <div class="item-wrapper">
    <div class="left">
      <div class="top">
        <div class="top-left">
${((element.class_type===1&&'小班')||(element.class_type===2&&'私教')||(element.class_type===4&&'团课'))}
        </div>
        <div class="top-right">
${dateString.getMonth()+1}月${dateString.getDate()}日 ${formatSeconds(element.start_time)}
        </div>
      </div>
      <div class="bottom">
${element.lesson_name}
      </div>
    </div>
    <img class="right" src="${SETTINGS.cdn}/images/${element.thumbnail}">
  </div>
</div>`;
})} 
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-user-lessons', CustomUserLessons);
/*
<!--
<script type="module" src="../components/custom-user-lessons.js"></script>
<custom-user-lessons bind @submit=""></custom-user-lessons>
                                         -->
                                     */

function formatSeconds(s) {
  if (isNaN(s)) return '0:00';
  if (s < 0) s = -s;
  const time = {
    hour: Math.floor(s / 3600) % 24,
    minute: Math.floor(s / 60) % 60,
  };
  return Object.entries(time)
    .filter((val, index) => index || val[1])
    .map(val => (val[1] + '').padStart(2, '0'))
    .join(':');
}
