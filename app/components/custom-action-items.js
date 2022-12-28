import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomActionItems extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.wrapper {
  box-sizing: border-box;
  padding: 0 16px;
}

.item {
  border-top: 1px solid #dadce0;
  padding: 8px 0;
  min-height: 43px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  letter-spacing: .01785714em;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.25rem;
  color: #202124;
  text-overflow: ellipsis;
  text-align: right;
  overflow: hidden;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}

.subtitle {
  display: flex;
  align-items: center;
  letter-spacing: .07272727em;
  font-family: Roboto, Arial, sans-serif;
  font-size: .6875rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #5f6368;
  line-height: .6875rem;
  margin-right: 8px;
  white-space: nowrap;
}`;

  constructor() {
    super();
    this.data = [];
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="wrapper">
  ${this.data .map((element,index)=>{
return html`<div class="item">
    <div class="title"></div>
    <div class="subtitle"></div>
  </div>`;
})}
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-action-items', CustomActionItems);
/*
<!--
<script type="module" src="./components/custom-action-items.js"></script>
<custom-action-items></custom-action-items>
-->
*/