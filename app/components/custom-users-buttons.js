import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUsersButtons extends LitElement {
  static properties = {
    data: {},
    selected: {}
  };
  static styles = css`:host{
display:flex;align-items: center;gap:8px;padding:16px;
}`;

  constructor() {
    super();
  }
  click(evt) {
    const index = parseInt(evt.currentTarget.dataset.index);
    this.selected = index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`${this.data .map((element,index)=>{
return html`<custom-button .selected="${index===this.selected}" title="${element.title}" data-index="${index}" @click="${this.click}"></custom-button>`;
})}`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.selected = 0;
    this.data = [{
      title: '活跃用户',
    }, {
      title: '全部',
    }]
  }
}
customElements.define('custom-users-buttons', CustomUsersButtons);
/*
<!--
<script type="module" src="./components/custom-users-buttons.js"></script>
<custom-users-buttons></custom-users-buttons>
-->
*/