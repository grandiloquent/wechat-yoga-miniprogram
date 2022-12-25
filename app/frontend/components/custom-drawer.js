import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomDrawer extends LitElement {
  static properties = {
    expand: {},
    data: {}
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

    return html`<div class="wrapper" style="${this.expand ? 'transform: translateX(0);visibility: visible;box-shadow: 0 0 16px rgba(0,0,0,.28);transition: transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear 0s;overflow-y: visible;width: 256px;' : 'transition:transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear .25s;transform:translateX(-264px)'}" @click="${this.hide}">
  <div style="position: relative;top: 2px;-webkit-user-select: none;min-height: 48px;display: table-cell;height: 48px;vertical-align: middle;padding-top: 4px;padding-bottom: 4px;padding-left: 16px;">
  </div>
  <div style="display: flex;flex: 1 1 auto;flex-direction: column;">
    ${this.data .map((element,index)=>{
    return html`<a style="text-decoration: none;letter-spacing: .01785714em;font-size: .875rem;font-weight: 500;line-height: 1.25rem;height: 48px;display: flex;-webkit-box-align: center;align-items: center;padding-left: 24px;padding-right: 12px;margin-right: 8px;border-radius: 0 50px 50px 0;cursor: pointer;color: inherit;" href="${element.href}">
      <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
        ${element.name}
      </div>
    </a>`;
})}
  </div>
</div>
<div style="position:fixed;right:0;top:0;left:0;bottom:0;${this.expand?'display:block':'display:none'}" @click="${this.hide}"></div>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.data = [{
      name: "首页",href:"/"
    }];
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