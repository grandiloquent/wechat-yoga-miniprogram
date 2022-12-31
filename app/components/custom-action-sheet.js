import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomActionSheet extends LitElement {
  static properties = {
    title: {},

    data: {}
  };
  static styles = css`.overlay{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.7);z-index:2046;}.popup{position:fixed;background-color:#fff;transition:transform 0.3s,-webkit-transform 0.3s;bottom:0;left:0;width:100%;padding-bottom:env(safe-area-inset-bottom);display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;flex-direction:column;max-height:80%;overflow:hidden;color:#323233;border-radius:16px 16px 0 0;z-index:2047;}.description{position:relative;flex-shrink:0;padding:20px 16px;color:#969799;font-size:14px;line-height:20px;text-align:center;}.content{flex:1 auto;overflow-y:auto;}.item{display:block;width:100%;padding:14px 16px;font-size:16px;background-color:#fff;border:none;cursor:pointer;line-height:22px;box-sizing:border-box}.gap{display:block;height:8px;background-color:#f7f8fa;}.close{display:block;width:100%;padding:14px 16px;font-size:16px;background-color:#fff;border:none;cursor:pointer;flex-shrink:0;box-sizing:border-box;color:#646566;}`;
  constructor() {
    super();
    this.title = null;

    this.data = [];
  }
  _close(evt) {
    evt.stopPropagation();
    this.style.display = "none";
    this.dispatchEvent(new CustomEvent('close'));
  }
  _item(evt) {
    evt.stopPropagation();
    this.style.display = "none";
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('item', {
      detail: index
    }));
  }
  render() {
    return html`<div class="overlay" @click=${this._close}>
</div>
<div class="popup">
  <div class="description">${this.title}</div>
  <div class="content">
    ${this.data .map((element,index)=>{
    return html`<div class="item" data-index="${index}" @click=${this._item}>${element}</div>`;
    })}
    <div class="gap">
    </div>
    <div class="close" @click=${this._close}>取消</div>
  </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-action-sheet', CustomActionSheet);
/*
<!--
<script type="module" src="../components/custom-action-sheet.js"></script>
<custom-action-sheet bind @submit=""></custom-action-sheet>
                                         -->
                                     */