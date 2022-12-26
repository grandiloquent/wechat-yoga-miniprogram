import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomLoader extends LitElement {
  static properties = {
    duration: {},
    end: {
      state: true
    },
  };
  static styles = css`.wrapper {
  max-height: 999999px;
  background: #f1f3f4;
  display: flex;
  font-size: 14px;
  font-family: Google Sans, Roboto-Medium, HelveticaNeue-Medium, Helvetica Neue, sans-serif-medium, Arial, sans-serif;
  font-weight: 400;
  color: #202124;
  align-items: center;
  padding-left: 16px;
  padding-right: 16px;
  height: 40px;
  border-radius: 30px;
}

:host {
  cursor: pointer;
  display: block;
  line-height: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 16px;
  padding-top: 0;
  position: relative;
  outline: 0;
  margin-top: 6px;
}

.left {
  color: #202124;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: auto;
  margin-left: auto;
  padding-left: 0;
  padding-right: 8px;
}

.right {
  display: inline-block;
  fill: currentColor;
  position: relative;
  color: #202124;
  margin: -2px 24px -2px 0;
  margin-right: auto;
  height: 20px;
  line-height: 20px;
  width: 20px;
}`;

  constructor() {
    super();
  }

  render() {
    return html`<div class="wrapper">
  <div class="left">
    更多文章
  </div>
  <div class="right">
    <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"></path>
    </svg>
  </div>
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-loader', CustomLoader);
/*
<!--
<script type="module" src="./components/custom-loader.js"></script>
<custom-loader></custom-loader>
-->
*/