import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUserItem extends LitElement {
  static properties = { 
   data:{  }
  };
  static styles = css` :host {
   border-top: 1px solid #e8eaed;
   display: block;
   padding: 12px 0;
 }

 .wrapper {
   display: flex;
   -webkit-box-orient: horizontal;
   flex-direction: row;
 }

 .left {
   flex-grow: 1;
 }

 .right {
   border: none;
   border-radius: 8px;
   object-fit: cover;
   align-self: end;
   margin-left: 16px;
   height: 92px;
   width: 92px;
 }

 .top {
   -webkit-box-orient: horizontal;
   flex-direction: row;
   color: #5f6368;
   display: flex;
   flex-wrap: wrap;
   letter-spacing: .01428571em;
   font-family: Roboto, Arial, sans-serif;
   font-weight: 400;
   font-size: 12px;
   line-height: 16px;
 }

 .bottom {
   letter-spacing: .00625em;
   font-family: "Google Sans", Roboto, Arial, sans-serif;
   color: #202124;
   font-size: 16px;
   line-height: 24px;
   font-weight: 500;
   padding-top: 8px;
 }

 .top-left {
   font-weight: 500;
 }

 .top-left:after {
   content: "\\0000a0\\002022\\0000a0";
   padding-right: 8px;
   padding-left: 6px;
 }

 .top-right {
   display: inline-flex;
 }`;

  constructor() {
    super();
  }

  render() {
console.log(JSON.stringify(this.data));
    return html`<div class="wrapper">
  <div class="left">
    <div class="top">
      <div class="top-left">
${this.data.nick_name}
      </div>
      <div class="top-right">
${this.data.nick_name}
      </div>
    </div>
    <div class="bottom"></div>
  </div>
  <img class="right" src="${this.data.avatar_url}">
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
 
  }
}
customElements.define('custom-user-item', CustomUserItem);
/*
<!--
<script type="module" src="./components/custom-user-item.js"></script>
<custom-user-item></custom-user-item>
-->
*/