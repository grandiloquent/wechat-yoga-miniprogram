import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomDrawer extends LitElement {
  static properties = {
    expand: {},
  };
  static styles = css`.wrapper {
  background-color: #fff;
  bottom: 0;
  color: #000;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 990;
  will-change: visibility;
  display: flex;
  flex-direction: column;
}
`;

  constructor() {
    super();
  }
  show() {
    this.expand = true;
  }
  hide() {
    this.expand = null;
  }
  render() {
    const style = this.expand ? 'transform: translateX(0);visibility: visible;box-shadow: 0 0 16px rgba(0,0,0,.28);transition: transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear 0s;overflow-y: visible;width: 256px;' : 'transition:transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear .25s;transform:translateX(-264px)';
    return html`<div class="wrapper" style="${style}" @click="${this.hide}"></div>
<div style="position:fixed;right:0;top:0;left:0;bottom:0;${this.expand?'display:block':'display:none'}" @click="${this.hide}"></div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {}
}
customElements.define('custom-drawer', CustomDrawer);
/*
<!--
<script type="module" src="./components/custom-drawer.js"></script>
<custom-drawer></custom-drawer>


-->
*/