import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomDialog extends LitElement {
  static properties = {
    message: {},

    title: {},

    data: {}
  };
  static styles = css`.wrapper{position:fixed;top:0;left:0;right:0;bottom:0;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;z-index:4;margin:0 40px;padding:0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);}.dialog{position:relative;z-index:2;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;max-height:100%;box-sizing:border-box;padding:16px;margin:0 auto;overflow-x:hidden;overflow-y:auto;font-size:13px;color:#0f0f0f;border:none;min-width:250px;max-width:356px;box-shadow:0 0 24px 12px rgba(0,0,0,0.25);border-radius:12px;background-color:#fff;}.dialog-header{display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;flex-shrink:0;}.h2{margin:0 0 3px;display:-webkit-box;-webkit-box-orient:vertical;max-height:2.5em;-webkit-line-clamp:2;overflow:hidden;line-height:1.25;text-overflow:ellipsis;font-weight:normal;font-size:18px;}.dialog-body{overflow-y:auto;overflow-x:hidden;max-height:100vh;white-space:pre-wrap;}.dialog-buttons{display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:end;justify-content:flex-end;margin-top:12px;}.button{display:flex;align-items:center;justify-content:center;padding:0 16px;height:36px;font-size:14px;line-height:36px;border-radius:18px;color:#0f0f0f;}.disabled{color:#909090}.overlay{position:fixed;top:0;bottom:0;left:0;right:0;z-index:1;cursor:pointer;background-color:rgba(0,0,0,0.3);}`;
  constructor() {
    super();
    this.message = null;

    this.title = null;

    this.data = [];
  }
  _close(evt){
    evt.stopPropagation();
    this.style.display = "none";
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 1
    }));
  }
_submit(evt){
    evt.stopPropagation();
    this.style.display = "none";
    this.dispatchEvent(new CustomEvent('submit', {
      detail: 2
    }));
  }
render() {
    return html`<div class="wrapper">
  <div class="dialog">
    <div class="dialog-header">
      <h2 class="h2">${this.title}</h2>
    </div>
    <div class="dialog-body">${this.message}</div>
    <div class="dialog-buttons">
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
customElements.define('custom-dialog', CustomDialog);
/*
<!--
<script type="module" src="../components/custom-dialog.js"></script>
<custom-dialog bind @submit=""></custom-dialog>
                                         -->
                                     */