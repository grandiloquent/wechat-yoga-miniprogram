import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomLesson extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.top{position:relative;height:168px;position:relative;}.shadow{background-image:linear-gradient(to bottom,rgba(32,33,36,0.149) 0%,rgba(32,33,36,0.078) 30%,rgba(32,33,36,0) 100%);height:72px;pointer-events:none;position:absolute;top:0;width:100%;}.back{width:48px;height:48px;padding:12px;display:inline-block;box-sizing:border-box;fill:currentColor;z-index:0;background:rgba(0,0,0,.38);border:1px solid transparent;border-radius:35px;color:#fff;margin:16px 0 0 8px;}.middle{margin:20px 24px 0;}.bottom{border-bottom:solid 1px #e5e5e5;margin-bottom:6px;padding-bottom:16px;box-sizing:border-box;}.h1{margin:0;padding:0;font-weight:500;font-size:24px;line-height:32px;letter-spacing:normal;color:#202124;margin-bottom:4px;text-align:left;}.info{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 0 auto;width:100%;align-items:baseline;display:flex;margin:-14px 0;}.info-item{display:inline-block;padding:14px 0;}.info-text{align-items:center;color:#5f6368;display:inline-flex;height:16px;font-size:14px;}.info-separator{margin:0 5px;color:#5f6368;}.buttons{display:flex;justify-content:space-around;margin:16px 12px 0 12px;font-size:12px;}.button{cursor:pointer;display:inline-flex;align-items:center;flex-direction:column;flex:0 1 auto;justify-content:flex-start;text-align:center;width:84px;color:rgb(25,103,210);fill:currentColor;}.button>svg{margin-bottom:8px;}`;
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
    return html`
  <div class="top">
  <div class="shadow">
  </div>
  <div class="back">
    <svg width="24" height="24" viewBox="0 0 24 24" focusable="false">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
    </svg>
  </div>
</div>
<div class="middle">
  <h1 class="h1">
    瑜伽
  </h1>
  <div class="info">
    <div class="info-item">
      <span class="info-text">
        团课
      </span>
      <span class="info-separator">·</span>
    </div>
  </div>
</div>
<div class="buttons">
<div class="button">
<svg width="20" height="20" viewBox="0 0 24 24" focusable="false"><path d="M16.02 14.46l-2.62 2.62a16.141 16.141 0 0 1-6.5-6.5l2.62-2.62a.98.98 0 0 0 .27-.9L9.15 3.8c-.1-.46-.51-.8-.98-.8H4.02c-.56 0-1.03.47-1 1.03a17.92 17.92 0 0 0 2.43 8.01 18.08 18.08 0 0 0 6.5 6.5 17.92 17.92 0 0 0 8.01 2.43c.56.03 1.03-.44 1.03-1v-4.15c0-.48-.34-.89-.8-.98l-3.26-.65c-.33-.07-.67.04-.91.27z"></path></svg>
<div>
电话
</div>
 </div>
  </div>
<div class="bottom">
</div>
`;
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