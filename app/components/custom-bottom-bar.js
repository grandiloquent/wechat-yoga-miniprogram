import {
  LitElement,
  html,
  css,
  svg
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
  }
  navigate(e) {
    this.dispatchEvent(new CustomEvent('submit', {detail:e.currentTarget.dataset.href}));
  }
  render() {
    return html`${this.data .map((element,index)=>{
return html`<div class="item" data-href="${element.href}" @click="${this.navigate}">
<svg  height="24" viewBox="0 0 24 24" width="24">${element.path}</svg>
<div class="item-title">
${element.title}
  </div>
  </div>`;
})}`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.data = [{
      path: svg`<path d="M21.516 20.484v-13.969q0-0.422-0.305-0.727t-0.727-0.305h-9.047l1.313 3.797h1.453v-1.266h1.266v1.266h4.547v1.313h-1.922q-0.703 2.344-2.391 4.219l3.281 3.281-0.938 0.891-3.094-3.094 1.031 3.094-1.969 2.531h6.469q0.422 0 0.727-0.305t0.305-0.727zM13.172 10.594l0.797 2.344 0.844 1.125q1.453-1.594 2.063-3.469h-3.703zM6.984 15.984q2.156 0 3.492-1.359t1.336-3.516q0-0.047-0.141-1.031h-4.688v1.734h2.953q-0.094 0.891-0.844 1.641t-2.109 0.75q-1.313 0-2.227-0.938t-0.914-2.25q0-1.359 0.914-2.297t2.227-0.938q1.266 0 2.063 0.797l1.313-1.266q-1.453-1.313-3.375-1.313-2.063 0-3.516 1.477t-1.453 3.539 1.453 3.516 3.516 1.453zM21 3.984q0.797 0 1.406 0.609t0.609 1.406v15q0 0.797-0.609 1.406t-1.406 0.609h-9l-0.984-3h-8.016q-0.797 0-1.406-0.609t-0.609-1.406v-15q0-0.797 0.609-1.406t1.406-0.609h6.984l1.031 3h9.984z"></path>
`,
      title: "翻译",
      href: "translate"
    },{
      path: svg`<path d="M15 9v-3.984h-9.984v3.984h9.984zM12 18.984q1.219 0 2.109-0.891t0.891-2.109-0.891-2.109-2.109-0.891-2.109 0.891-0.891 2.109 0.891 2.109 2.109 0.891zM17.016 3l3.984 3.984v12q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.844 0.586-1.43t1.43-0.586h12z"></path>
`,
      title: "保存",
      href: "save"
    }]
  }
}
customElements.define('custom-bottom-bar', CustomBottomBar);
/*
<!--
<script type="module" src="./components/custom-bottom-bar.js"></script>
<custom-bottom-bar></custom-bottom-bar>
-->
*/