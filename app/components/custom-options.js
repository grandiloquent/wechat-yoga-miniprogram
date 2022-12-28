import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomOptions extends LitElement {
  static properties = {
    data: {},
    selectedItem: {},
    title: {}
  };
  static styles = css`:host {
  border-top: 1px solid #dadce0;
  padding: 20px 0 24px;
  color: #202124;
user-select:none;
}

.layout {
  margin: 0 24px;
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid #dadce0;
  border-radius: 8px;
  background: #dadce0;
  overflow: hidden;
}

.title {
  padding: 0 24px 24px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 500px;
  margin: 0;
}

.item {
  padding: 8px;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  background: #fff;
}

.item.selected {
  background: #e8f0fe;
  color: #1967d2;
}`;

  constructor() {
    super();
    this.data = [];
    this.selectedItem = null;
    this.title = null;
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    if (!index) return;

    this.selectedItem = index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<h2 class="title">${this.title}</h2>
      <div class="layout">
${this.data .map((element,index)=>{
return html`<div class="item ${this.selectedItem===element?'selected':''}" data-index="${element}" @click=${this.navigate}>${element}</div>`;
})}
      </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-options', CustomOptions);
/*
<!--
<script type="module" src="./components/custom-options.js"></script>
<custom-options></custom-options>
-->
*/