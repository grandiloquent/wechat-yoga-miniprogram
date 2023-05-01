import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
export class CustomActions extends LitElement {
  static properties = {
    data: {},
    end: {
      state: true
    },
  };
  static styles = css`.item-name{font-size:14px;font-weight:500;line-height:20px;margin:12px 4px 0;color:#3c4043;text-align:center;overflow:hidden;text-overflow:ellipsis;vertical-align:top;white-space:normal;}.item-image{width:40px;height:40px;border:1px solid #dadce0;border-radius:999rem;display:flex;align-items:center;justify-content:center;fill:currentColor;color:#70757a;}.item{display:flex;align-items:center;justify-content:center;flex-direction:column;}.wrapper{margin:16px 20px;display:grid;grid-template-columns:repeat(5,1fr);row-gap:16px;cursor:pointer;}`;

  constructor() {
    super();
    this.local = window.location.host === "127.0.0.1:5500";
    this.data = [];
  }
  navigate(e) {
    const href = e.currentTarget.dataset.href;
    window.location = `./${href}${this.local?`.html`:''}`;
  }

  render() {
    return html`  
<div class="wrapper">
${this.data .map((element,index)=>{
const svg=document.createElementNS("http://www.w3.org/2000/svg",'svg');
svg .setAttribute('viewBox','0 0 24 24');
svg.style="width:24px;height:24px;"
svg.innerHTML=element.path
return html`<div class="item" @click="${this.navigate}" data-href="${element.href}">
  <div class="item-image">
    ${svg}
  </div>
  <div class="item-name">
    ${element.title}
  </div>
</div>`;
})}
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();

  }
}
customElements.define('custom-actions', CustomActions);
/*
<!--
<script type="module" src="./components/custom-actions.js"></script>
<custom-actions></custom-actions>
-->
*/