import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomSubmitBar extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`:host {
position: fixed;
right: 0;
left: 0;
bottom: 0;
height: 68px;
}
.wrapper {
align-items: center;
padding: 0 16px;
display: flex;
flex: 0 0 auto;
height: 68px;
background: #fff;
box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .3), 0 2px 6px 2px rgba(60, 64, 67, .15);
}
.left {
flex: 1 1 auto;
}
.right {
display: flex;
align-items: center;
justify-content: center;
gap:8px;
}
.button {
display: inline-flex;
align-items: center;
justify-content: center;
box-sizing: border-box;
min-width: 64px;
-webkit-user-select: none;
font-family: "Google Sans", Roboto, Arial, sans-serif;
font-size: .875rem;
letter-spacing: .0107142857em;
font-weight: 500;
padding: 0 24px 0 24px;
border-radius: 16px;
height: 32px;
color:rgb(26, 115, 232);
}.button-blue{
background-color: #1a73e8;
color: #fff;
}`;
  constructor() {
    super();
    this.data = {};
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="wrapper">
  <div class="left">
  </div>
  <div class="right">
 <div class="button" data-index="0" @click=${this.navigate}>
      取消
    </div>
    <div class="button button-blue" data-index="1" @click=${this.navigate}>
      完成
    </div>
  </div>
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-submit-bar', CustomSubmitBar);
/*
<!--
<script type="module" src="./components/custom-submit-bar.js"></script>
<custom-submit-bar></custom-submit-bar>
-->
*/