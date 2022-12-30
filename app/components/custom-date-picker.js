import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomDatePicker extends LitElement {
  static properties = {
    data: {},
    _weeks: {},
    _date: {}
  };
  static styles = css`.dialog-body{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;padding:16px;}.title{font-size:20px;line-height:24px;font-weight:500;margin:0px 0px 16px 0px;color:rgb(32,33,36);grid-column:3 / 6;text-align:center;}:host{color:#0f0f0f;-webkit-text-size-adjust:100%;font-size:12px;z-index:1002;position:fixed;top:0;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:center;}.dialog{position:relative;z-index:1002;max-height:180px;overflow-y:auto;color:#0f0f0f;width:90vw;border-radius:8px;background-color:#fff;overflow-y:auto;}.dialog::-webkit-scrollbar{display:none;}.overlay{font-family:Roboto,Arial,sans-serif;word-wrap:break-word;color:#0f0f0f;-webkit-text-size-adjust:100%;font-size:1.2rem;position:fixed;top:0;bottom:0;left:0;right:0;z-index:1001;cursor:pointer;background-color:rgba(0,0,0,0.3);}`;
  constructor() {
    super();
    this.data = [];
    this._weeks = ['日', '一', '二', '三', '四', '五', '六'];
    const now = new Date();
    this._date = `${now.getFullYear()}年${now.getMonth()+1}月`
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="dialog">

<div class="dialog-body">
 <div style="grid-column:  1 / 3;">
</div>
<div class="title">${this._date}</div>
<div style="grid-column:  6 / 8;">
</div>
${this._weeks .map((element,index)=>{
return html`<div style="font-size: 14px;line-height: 20px;text-align:center;color: #333;color: rgb(95, 99, 104);" data-index="${index}">${element}</div>`;
})}
</div>
${this.data .map((element,index)=>{
return html`<div class="item" data-index="${index}" @click="${this.navigate}">${element}</div>`;
})}
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