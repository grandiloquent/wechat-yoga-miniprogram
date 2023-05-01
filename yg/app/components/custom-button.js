import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomButton extends LitElement {
  static properties = {
    selected: {
attribute: true,
      type: Boolean,
      hasChanged(value, oldValue) {
        if (value) {
          console.log(this);
        }
        return true;
      }
    },
title:{}
  };
  static styles = css`.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  letter-spacing: .01785714em;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.25rem;
  border-radius: 24px;
  box-sizing: border-box;
  border: 1px solid #dadce0;
  color: #3c4043;
  padding: 5px 13px;
}

.selected {
  border: 1px solid transparent;
  background: #e8f0fe;
  color: #1967d2;
}`;

  constructor() {
    super();
  }

  render() {
    return html`<div class="wrapper ${this.selected?'selected':''}">${this.title}</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-button', CustomButton);
/*
<!--
<script type="module" src="./components/custom-button.js"></script>
<custom-button></custom-button>
-->
*/