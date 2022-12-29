import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomTextarea extends LitElement {
  static properties = {
    placeholder: {},
    label: {},
    value: {}
  };
  static styles = css`:host {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.wrapper {
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
  cursor: pointer;
}

:focus {
  outline: none
}

textarea {
  padding: 16px;
  width: 100%;
  border: none;
  flex-grow: 1;
box-sizing:border-box;
}

.title {
  flex: 1;
}

.right {
  height: 24px;
  margin-left: 4px;
  color: #969799;
width:16px;
display:flex;align-items: center;justify-content: center;
fill:currentcolor;
}`;
  constructor() {
    super();
    this.placeholder = null;
    this.label = null;
    this.value = null;
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
    return html`<div class="wrapper">
  <div class="title">${this.label}</div>
  <div class="right">
    <svg viewBox="0 0 24 24">
      <path d="M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z"></path>
      </svg>
  </div>
</div>
<textarea placeholder=${this.placeholder} .value=${this.value} @input=${this._input}></textarea>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-textarea', CustomTextarea);
/*
<!--
<script type="module" src="../components/custom-textarea.js"></script>
<custom-textarea bind @submit=""></custom-textarea>
                                         -->
                                     */