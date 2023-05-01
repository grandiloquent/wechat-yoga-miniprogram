import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
export class CustomDialogReplace extends LitElement {
  static properties = {
    message: {},

    title: {},
    find: {},
    repalce: {},
    data: {}
  };
  static styles = css`.wrapper{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;z-index:4;margin:0 40px;padding:0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);}.dialogReplace{position:relative;z-index:2;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;max-height:100%;box-sizing:border-box;padding:16px;margin:0 auto;overflow-x:hidden;overflow-y:auto;font-size:13px;color:#0f0f0f;border:none;min-width:250px;max-width:356px;box-shadow:0 0 24px 12px rgba(0,0,0,0.25);border-radius:12px;background-color:#fff;}.dialogReplace-header{display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-shrink:0;}.h2{margin:0 0 3px;display:-webkit-box;-webkit-box-orient:vertical;max-height:2.5em;-webkit-line-clamp:2;overflow:hidden;line-height:1.25;text-overflow:ellipsis;font-weight:normal;font-size:18px;}.dialogReplace-body{overflow-y:auto;overflow-x:hidden;max-height:100vh;white-space:pre-wrap;}.dialogReplace-buttons{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end;margin-top:12px;}.button{display:flex;align-items:center;justify-content:center;padding:0 16px;height:36px;font-size:14px;line-height:36px;border-radius:18px;color:#0f0f0f;}.disabled{color:#909090}.overlay{position:fixed;top:0;bottom:0;left:0;right:0;z-index:1;cursor:pointer;background-color:rgba(0,0,0,0.3);}`;
  constructor() {
    super();
    this.message = null;

    this.title = "查找和替换";
    this.find ="";
    this.replace = "";
    this.data = [];
  }
  _close(evt) {
    evt.stopPropagation();
    this.style.display = "none";
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 1
    }));
  }
  _submit(evt) {
    evt.stopPropagation();
    this.style.display = "none";
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 2
    }));
  }
  /*
  {
        id,
        value: element.value
      }
      */
  _input(evt) {
    const element = evt.currentTarget;
    const id = element.dataset.id;
    if (id === "1") {
      this.find = element.value;
    } else if (id === "2") {
      this.replace = element.value;
    }
  }
  render() {
    return html`<div class="wrapper">
  <div class="dialogReplace">
    <div class="dialogReplace-header">
      <h2 class="h2">${this.title}</h2>
    </div>
    <div class="dialogReplace-body">
    
    <input type="text" data-id="1" @input=${this._input}>
    <input type="text" data-id="2" @input=${this._input}>
    </div>
    <div class="dialogReplace-buttons">
      <div class="button" @click=${this._close}>
        取消
      </div>
      <div class="button disabled" @click=${this._submit}>
        确定
      </div>
    </div>
  </div>
<div class="overlay" @click=${this._close}>
</div>
</div>
`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-dialog-replace', CustomDialogReplace);
/*
<!--
<script type="module" src="../components/custom-dialog-replace.js"></script>
<custom-dialog-replace bind @submit=""></custom-dialog-replace>
                                         -->
                                     */