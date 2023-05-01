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
  static styles = css`:host{display:flex;align-items:center;justify-content:center;flex-direction:column;}.wrapper{position:relative;display:flex;box-sizing:border-box;width:100%;padding:10px 16px;overflow:hidden;color:#323233;font-size:14px;line-height:24px;background-color:#fff;cursor:pointer;}:focus{outline:none}textarea{padding:16px;width:100%;border:none;flex-grow:1;box-sizing:border-box;}.title{flex:1;}.right{height:24px;width:16px;margin-left:4px;color:#969799;display:flex;align-items:center;justify-content:center;fill:currentcolor;}`;
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
    <svg viewBox="0 0 1024 1024">
      <path d="M505.952256 751.028224a42.467328 42.467328 0 0 1-20.503552-11.393024L143.52384 397.709312c-16.662528-16.661504-16.662528-43.676672 0-60.3392 16.661504-16.662528 43.676672-16.662528 60.3392 0L515.74784 649.253888 827.582464 337.41824c16.661504-16.662528 43.676672-16.662528 60.3392 0s16.662528 43.677696 0 60.340224L545.9968 739.683328c-10.861568 10.861568-26.120192 14.6432-40.044544 11.34592z"></path>
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