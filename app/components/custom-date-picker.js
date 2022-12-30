import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomDatePicker extends LitElement {
  static properties = {
    data: {},
    _weeks: {},
    _date: {},
    _now: {},
    _pad: {},
    selectedDate: {}
  };
  static styles = css`.button{height:36px;font-size:14px;line-height:36px;border-radius:18px;padding:0px 16px;}.button-blue{color:#fff;background-color:#065fd4}.next{grid-column:7 / 8;}.pre{grid-column:1 / 2;}.nav{height:24px;width:100%;display:flex;align-items:center;justify-content:center;color:rgb(95,99,104);fill:currentColor;}svg{height:24px;width:24px;}.item{height:36px;width:36px;display:flex;align-items:center;justify-content:center;color:rgb(32,33,36);font-size:14px;line-height:20px;border-radius:100%}.item.selected{background:rgb(26,115,232);color:#fff;}.week{font-size:14px;line-height:20px;text-align:center;color:#333;color:rgb(95,99,104);height:36px;display:flex;align-items:center;justify-content:center;}.dialog-body{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;padding:16px 16px 0 16px;justify-items:center;}.title{font-size:20px;line-height:24px;font-weight:500;margin:0px 0px 16px 0px;color:rgb(32,33,36);grid-column:3 / 6;text-align:center;}:host{color:#0f0f0f;-webkit-text-size-adjust:100%;font-size:12px;z-index:1002;position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;}.dialog{position:relative;z-index:1002;overflow-y:auto;color:#0f0f0f;width:90vw;border-radius:8px;background-color:#fff;overflow-y:auto;}.dialog::-webkit-scrollbar{display:none;}.overlay{font-family:Roboto,Arial,sans-serif;word-wrap:break-word;color:#0f0f0f;-webkit-text-size-adjust:100%;font-size:1.2rem;position:fixed;top:0;bottom:0;left:0;right:0;z-index:1001;cursor:pointer;background-color:rgba(0,0,0,0.3);}.buttons{display:flex;align-items:center;justify-content:flex-end;margin:12px 16px 16px;}`;
  constructor() {
    super();
    const now = new Date();
    this._now = now;
    this.data = this._getDays(now.getMonth() + 1, now.getFullYear());
    this._weeks = ['日', '一', '二', '三', '四', '五', '六'];
    this._date = `${now.getFullYear()}年${now.getMonth()+1}月`;
    this._pad = [...new Array(this.data[0].getDay()).keys()];
    now.setHours(0, 0, 0, 0);
    this.selectedDate = now.getTime();
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.selectedDate = parseInt(index)
  }
  _getDays(month, year) {
    return Array.from({
        length: new Date(year, month, 0).getDate()
      },
      (_, i) => new Date(year, month - 1, i + 1)
    )
  }
  close() {
    this.remove();
  }
  render() {
    return html`<div class="dialog">
  <div class="dialog-body">
    <div class="nav pre">
      <svg viewBox="0 0 24 24">
        <path d="M15.422 16.594l-1.406 1.406-6-6 6-6 1.406 1.406-4.594 4.594z"></path>
      </svg>
    </div>
    <div class="title">${this._date}</div>
    <div class="nav next">
      <svg viewBox="0 0 24 24">
        <path d="M8.578 16.594l4.594-4.594-4.594-4.594 1.406-1.406 6 6-6 6z"></path>
      </svg>
    </div>
    ${this._weeks .map((element,index)=>{
    return html`<div class="week" data-index="${index}">${element}</div>`;
    })}
    ${this._pad.map((element,index)=>{
    return html`<div class="item"></div>`;
    })}
    ${this.data .map((element,index)=>{
    console.log(element,this.selectedDate);
    return html`<div class="item ${this.selectedDate===element.getTime()?'selected':''}" data-index="${element.getTime()}" @click="${this.navigate}">${element.getDate()}</div>`;
    })}

  </div>
<div class="buttons">
  <div class="button" @click=${this.close}>
    取消
  </div>
 <div class="button button-blue" @click=${this._submit}>
    确定
  </div>
</div>
</div>
<div class="overlay" @click="${this.close}">
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-date-picker', CustomDatePicker);
/*
<!--
<script type="module" src="../components/custom-date-picker.js"></script>
<custom-date-picker bind @submit=""></custom-date-picker>
-->
*/