import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
export class CustomDrawer extends LitElement {
  static properties = {
    expand: {},
    data: {}
  };
  static styles = css`.name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.main {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
}

.overlay {
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 991;
  cursor: pointer;
}

.top {
  position: relative;
  top: 2px;
  -webkit-user-select: none;
  min-height: 48px;
  display: table-cell;
  height: 48px;
  vertical-align: middle;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-left: 16px;
}

.item {
  text-decoration: none;
  letter-spacing: .01785714em;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.25rem;
  height: 48px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  padding-left: 24px;
  padding-right: 12px;
  margin-right: 8px;
  border-radius: 0 50px 50px 0;
  cursor: pointer;
  color: inherit;
}

.wrapper {
  background-color: #fff;
  bottom: 0;
  color: #000;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 992;
  will-change: visibility;
  display: flex;
  flex-direction: column;
}

.divider {
  border-bottom: 1px solid #e8eaed;
  margin: 8px 8px 8px 0;
}`;

  constructor() {
    super();
    this.data = [{
      path: `<path d="M9.984 20.016h-4.969v-8.016h-3l9.984-9 9.984 9h-3v8.016h-4.969v-6h-4.031v6z"></path>
`,
      name: "首页",
      href: "/backend/index"
    }];
  }
  show() {
    this.expand = true;
  }
  hide() {
    this.expand = null;
  }
  render() {

    return html`
    <!--
    -->
<div class="wrapper" style="${this.expand ? 'transform: translateX(0);visibility: visible;box-shadow: 0 0 16px rgba(0,0,0,.28);transition: transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear 0s;overflow-y: visible;width: 256px;' : 'transition:transform .25s cubic-bezier(0.4,0.0,0.2,1),visibility 0s linear .25s;transform:translateX(-264px)'}" @click="${this.hide}">
  <div class="top">
  </div>
  <div class="main">
    ${this.data.map((element, index) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.innerHTML = element.path;

      return html`<a class="item" href="${element.href}">
<div
  style="width: 24px;height: 24px;fill: currentColor;color: #333;display:flex;align-items: center;justify-content: center;margin-right: 16px;">
  ${svg}
</div> 
      <div class="name">
        ${element.name}
      </div>
    </a>`;
    })}
  </div>
</div>
<div class="overlay" @click="${this.hide}" style="${this.expand ? 'display:block' : 'display:none'}"></div>`;
  }
  connectedCallback() {
    super.connectedCallback();

  }
  disconnectedCallback() { }
}
customElements.define('custom-drawer', CustomDrawer);
/*
<!--
<script type="module" src="./components/custom-drawer.js"></script>
<custom-drawer></custom-drawer>


-->
*/