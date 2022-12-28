import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomField extends LitElement {
  static properties = {
    placeholder: {},
    label: {},
    value: {},
    type: {},
  };
  static styles = css`:host {
  position: relative;
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 16px;
  overflow: hidden;
  color: #323233;
  font-size: 14px;
  line-height: 24px;
  background-color: #fff;
}

.label {

  -webkit-box-flex: 0;
  flex: none;
  box-sizing: border-box;
  width: 6.2em;
  margin-right: 12px;
  color: #646566;
  text-align: left;
  word-wrap: break-word;
}

.value {
  flex: 1;
  position: relative;
  color: #969799;
  text-align: right;
  vertical-align: middle;
  word-wrap: break-word;
  overflow: visible;
}

.input {
  font: inherit;
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  color: #323233;
  line-height: inherit;
  text-align: left;
  background-color: transparent;
  border: 0;
  resize: none;
}
input:focus{
outline:none;
}`;
  constructor() {
    super();
    this.data = {};

    this.placeholder = null;
    this.label = null;
    this.value = null;
    this.type = "text";
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  _input(evt) {
    this.value = evt.target.value;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: evt.target.value
    }));
  }
  render() {
    return html`<div class="label">
${this.label}
  </div><div class="value"><input class="input" type=${this.type} placeholder=${this.placeholder} .value=${this.value} @input=${this._input}>
  </div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-field', CustomField);
/*
<!--
<script type="module" src="./components/custom-field.js"></script>
<custom-field></custom-field>
-->
*/