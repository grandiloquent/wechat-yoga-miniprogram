import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
export class CustomDialogActions extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`
.item{
      background:#fff;padding:9px 12px;display:flex;align-items: center;justify-content: center;
      }:host {
  color: #0f0f0f;
  -webkit-text-size-adjust: 100%;
  font-size: 12px;
  z-index: 1002;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog {
  position: relative;
  z-index: 1002;
  max-height: 180px;
  overflow-y: auto;
  color: #0f0f0f;
  min-width: 250px;
  max-width: 356px;
  margin: 40px;
  border-radius: 8px;
  background-color: #fff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: #dadce0;
overflow-y:auto;

}
.dialog::-webkit-scrollbar{
display:none;
}
.overlay {
  font-family: Roboto, Arial, sans-serif;
  word-wrap: break-word;
  color: #0f0f0f;
  -webkit-text-size-adjust: 100%;
  font-size: 1.2rem;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
}`;

  constructor() {
    super();
    this.data = ["参数列表","缩进","排序行","上传图片","注释","代码块","代码段","SQL","翻译中文","执行代码","预览"];
  }
  close() {
    this.remove();
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="dialog">
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
customElements.define('custom-dialog-actions', CustomDialogActions);
/*
<!--
<script type="module" src="./components/custom-dialog-actions.js"></script>
<custom-dialog-actions></custom-dialog-actions>
-->
*/