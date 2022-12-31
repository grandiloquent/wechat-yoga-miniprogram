import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUserProfile extends LitElement {
  static properties = {
    data: {}
  };
  static styles = css`.banner {
  background-color: rgb(207, 217, 222);
  padding-bottom: 33.3333%;
}

.content {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 12px;
  margin-bottom: 16px;
}

.top {
  display: flex;
  flex-direction: row;
  -webkit-box-align: start;
  align-items: flex-start;
  -webkit-box-pack: justify;
  justify-content: space-between;
  flex-wrap: wrap;
}

.avatar {
  display: block;
  overflow: visible;
  height: auto;
  margin-bottom: 12px;
  margin-top: -15%;
  min-width: 48px;
  width: 25%;
  position: relative;
}

.avatar>img {
  position: absolute;
  top: 0;
  left: 0;
  background: #fff;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: rgb(0 0 0 / 3%) 0px 0px 2px inset;
}

.button {
  padding: 0 16px;
  margin-bottom: 12px;
  border: 1px solid rgb(207, 217, 222);
  font-size: 15px;
  line-height: 20px;
  min-height: 36px;
  min-width: 36px;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.info {
  margin: 4px 0 12px;
}

.nick-name {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: rgb(15, 20, 25);
  font-size: 20px;
  line-height: 24px;
  font-weight: 800;
}

.subtitle {
  margin-bottom: 12px;
}`;
  constructor() {
    super();
    this.data = [];
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  render() {
    return html`<div class="banner"></div>
<div class="content">
  <div class="top">
    <div class="avatar">
      <div style="padding-bottom:100%"></div><img style="" src="https://pbs.twimg.com/profile_images/1608660876588126211/p07qcxpF_200x200.jpg">
    </div>
    <div class="button">编辑</div>
  </div>
  <div class="info">
    <div class="nick-name">nick_name</div>
  </div>
<div class="subtitle">
</div>
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-user-profile', CustomUserProfile);
/*
<!--
<script type="module" src="../components/custom-user-profile.js"></script>
<custom-user-profile bind @submit=""></custom-user-profile>
                                         -->
                                     */