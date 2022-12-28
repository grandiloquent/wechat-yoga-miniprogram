import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomBottomBar extends LitElement {
  static properties = {
    data: {},
    end: {
      state: true
    },
  };
  static styles = css`.item-title {
  max-width: 100%;
  padding: 0 4px;
  box-sizing: border-box;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.item {

  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0%;
  min-width: 0;
  flex-direction: column;

}

:host {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  z-index: 3;
  height: 48px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  color: #0f0f0f;
  font-size: 12px;
  background: #fff;
user-select:none;
}`;

  constructor() {
    super();
this.data=[];
  }
  navigate(e) {
    this.dispatchEvent(new CustomEvent('submit', {
      detail: e.currentTarget.dataset.href
    }));
  }
  render() {
    return html`${this.data .map((element,index)=>{
const svg=document.createElementNS("http://www.w3.org/2000/svg",'svg');
svg .setAttribute('viewBox','0 0 24 24');
svg.style="width:24px;height:24px;"
svg.innerHTML=element.path
return html`<div class="item" data-href="${element.href}" @click="${this.navigate}">
${svg}
<div class="item-title">
${element.title}
  </div>
  </div>`;
})}`;
  }
  connectedCallback() {
    super.connectedCallback();
  
  }
}
customElements.define('custom-bottom-bar', CustomBottomBar);
/*
<!--
<script type="module" src="./components/custom-bottom-bar.js"></script>
<custom-bottom-bar></custom-bottom-bar>
-->
*/
