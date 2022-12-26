import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUsers extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.wrapper{
padding:0 16px;
}`;

  constructor() {
    super();
  }

  render() {
    console.log(typeof this.data)
    return html`
<div class="wrapper">
${this.data.map((element,index)=>html`<custom-user-item .data="${element}"></custom-user-item>`)}
</div>
`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.data = [];
  }
}
customElements.define('custom-users', CustomUsers);
/*
<!--
<script type="module" src="./components/custom-users.js"></script>
<custom-users></custom-users>
-->
*/