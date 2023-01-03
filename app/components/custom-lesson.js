import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomLesson extends LitElement {
  static properties = {
    path: {},

    data: {}
  };
  static styles = css`.top{position:relative;height:168px;position:relative;overflow:hidden}.shadow{background-image:linear-gradient(to bottom,rgba(32,33,36,0.149) 0%,rgba(32,33,36,0.078) 30%,rgba(32,33,36,0) 100%);height:72px;pointer-events:none;position:absolute;top:0;width:100%;}.back{width:48px;height:48px;padding:12px;display:inline-block;box-sizing:border-box;fill:currentColor;z-index:1;background:rgba(0,0,0,.38);border:1px solid transparent;border-radius:35px;color:#fff;margin:16px 0 0 8px;}.middle{margin:20px 24px 0;}.bottom{border-bottom:solid 1px #e5e5e5;margin-bottom:6px;padding-bottom:16px;box-sizing:border-box;}.h1{margin:0;padding:0;font-weight:500;font-size:24px;line-height:32px;letter-spacing:normal;color:#202124;margin-bottom:4px;text-align:left;}.info{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 0 auto;width:100%;align-items:baseline;display:flex;margin:-14px 0;}.info-item{display:inline-block;padding:14px 0;}.info-text{align-items:center;color:#5f6368;display:inline-flex;height:16px;font-size:14px;}.info-separator{margin:0 5px;color:#5f6368;}.buttons{display:flex;justify-content:space-around;margin:16px 12px 0 12px;font-size:12px;}.button{cursor:pointer;display:inline-flex;align-items:center;flex-direction:column;flex:0 1 auto;justify-content:flex-start;text-align:center;width:84px;color:rgb(25,103,210);fill:currentColor;}.button>svg{margin-bottom:8px;}img{position:absolute;top:0;right:0;bottom:0;left:0;max-width:100%;z-index:-1}`;
  constructor() {
    super();
    this.path = `M12 20.016q1.828 0 3.516-0.984l-9.563-9.563q-0.938 1.594-0.938 3.516 0 2.906 2.039 4.969t4.945 2.063zM3 3.984l17.766 17.766-1.266 1.266-2.531-2.531q-2.344 1.5-4.969 1.5-3.75 0-6.375-2.648t-2.625-6.352q0-1.125 0.445-2.602t1.055-2.367l-2.766-2.766zM11.016 9.422v-1.406h1.969v3.422zM15 0.984v2.016h-6v-2.016h6zM19.031 4.547l1.406 1.406-1.406 1.453q1.969 2.484 1.969 5.578v0.047q0 1.125-0.445 2.578t-1.055 2.344l-1.453-1.453q0.938-1.594 0.938-3.516 0-2.906-2.039-4.945t-4.945-2.039q-1.875 0-3.469 0.938l-1.5-1.453q2.391-1.5 4.969-1.5 1.313 0 2.953 0.586t2.672 1.383z`;

    this.data = {};
  }
  _lessonStatus(evt) {
    evt.stopPropagation();
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 1
    }));
  }
  _lessonUpdate(evt) {
    evt.stopPropagation();
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 2
    }));
  }
 
_back(evt){
    evt.stopPropagation();
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 3
    }));
  }
render() {
    return html`<div class="top">

  <div class="shadow">
  </div>
  <img src="${SETTINGS.cdn}/images/${this.data.thumbnail}">
  <div class="back" @click=${this._back}>
    <svg width="24" height="24" viewBox="0 0 24 24" focusable="false">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
    </svg>
  </div>
</div>
<div class="middle">
  <h1 class="h1">${this.data.lesson_name}</h1>
  <div class="info">
    <div class="info-item">
      <span class="info-text">${ ((this.data.class_type === 1 && '小班') || (this.data.class_type === 2 && '私教') || (this.data.class_type === 4 && '团课'))}</span>
      <span class="info-separator">·</span>
      <span class="info-text">${this.data.teacher_name}</span>
      <span class="info-separator">·</span>
      <span class="info-text">${ shortDateString(this.data.date_time)} ${formatSeconds(this.data.start_time).replace(/^0/,'')}</span>
    </div>
  </div>
</div>
<div class="buttons">
  <div class="button" @click=${this._lessonStatus}>
    <svg width="20" height="20" viewBox="0 0 24 24" focusable="false">
      <path d="${this.path}"></path>
    </svg>
    <div>停课</div>
  </div>
  <div class="button" @click=${this._lessonUpdate}>
    <svg width="20" height="20" viewBox="0 0 24 24" focusable="false">
      <path d="M20.719 7.031l-1.828 1.828-3.75-3.75 1.828-1.828q0.281-0.281 0.703-0.281t0.703 0.281l2.344 2.344q0.281 0.281 0.281 0.703t-0.281 0.703zM3 17.25l11.063-11.063 3.75 3.75-11.063 11.063h-3.75v-3.75z"></path>
    </svg>
    <div>编辑</div>
  </div>
</div>
<div class="bottom">
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-lesson', CustomLesson);
/*
<!--
<script type="module" src="../components/custom-lesson.js"></script>
<custom-lesson bind @submit=""></custom-lesson>
                                         -->
                                     */
function shortDateString(seconds) {
  const date = new Date(seconds * 1000);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

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