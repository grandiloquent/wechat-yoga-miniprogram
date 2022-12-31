import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUserOptions extends LitElement {
  static properties = {
    selectedIndex: {},

    data: {}
  };
  static styles = css`.wrapper{position:relative;display:flex;height:100%;max-width:100%;overflow-y:hidden;overflow-x:overlay;padding-left:16px;padding-bottom:20px;margin-bottom:-20px;display:flex;gap:8px;user-select:none;}.wrapper::-webkit-scrollbar{display:none}.item{text-decoration:none;display:flex;-webkit-box-align:center;align-items:center;cursor:pointer;white-space:nowrap;outline:none;letter-spacing:.01785714em;font-family:"Google Sans",Roboto,Arial,sans-serif;font-size:.875rem;font-weight:500;line-height:1.25rem;border-radius:24px;box-sizing:border-box;border:1px solid #dadce0;color:#3c4043;padding:5px 13px;margin-right:8px;}.selected{border:1px solid transparent;background:#e8f0fe;color:#1967d2}`;
  constructor() {
    super();
    this.selectedIndex = 0;

    this.data = ["今天", "明天", "近 14 天", "过去 1 月", "过去 1 年", "全部"];
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }

  render() {
    return html`<div class="wrapper">
${this.data .map((element,index)=>{
return html`<div class="item ${this.selectedIndex===index?'selected':''}" data-index="${index}" >${element}</div>`;
})} 
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-user-options', CustomUserOptions);
/*
<!--
<script type="module" src="../components/custom-user-options.js"></script>
<custom-user-options bind @submit=""></custom-user-options>
                                         -->
                                     */