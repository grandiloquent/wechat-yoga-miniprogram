(() => {
  class CustomHeader extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      const style = document.createElement('style');
      style.textContent = `.header {
  color: black;
  min-width: 320px;
  transition: box-shadow 250ms;
  top: 0;
  width: 100%;
  display: block;
  font: 13px/27px Roboto, Arial, sans-serif;
  z-index: 986;
  position: fixed;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 1);
}

.wrapper {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transition: background-color .4s;
  padding: 4px;
  padding-left: 8px;
  min-width: 0;
}

.left {
  height: 48px;
  vertical-align: middle;
  white-space: nowrap;
  -webkit-box-align: center;
  align-items: center;
  display: flex;
  -webkit-user-select: none;
  box-sizing: border-box;
  padding-right: 14px;
  flex: 1 1 auto;
  overflow: hidden;
}

.middle {
  height: 48px;
  white-space: nowrap;
  align-items: center;
  display: flex;
  -webkit-user-select: none;
  justify-content: flex-end;
  flex: 0 0 auto;
}

.svg {
  fill: currentColor;
  opacity: 1;
  border-radius: 50%;
  padding: 8px;
  margin: 3px;
  color: unset;
  margin-left: 1px;
  margin-right: 1px;
}

.title {
  display: inline-block;
  font-size: 22px;
  line-height: 24px;
  position: relative;
  vertical-align: middle;
  color: #5f6368;
  opacity: 1;
  padding-left: 0;
}

.hamburger-menu {
  border-radius: 50%;
  display: inline-block;
  padding: 12px;
  overflow: hidden;
  vertical-align: middle;
  cursor: pointer;
  height: 24px;
  width: 24px;
  -webkit-user-select: none;
  flex: 0 0 auto;
  margin: 0 4px 0 0;
}`;
      this.shadowRoot.appendChild(style);
    }
    navigate(e) {
      this.dispatchEvent(new CustomEvent('submit'));
    }
    connectedCallback() {
      const header = document.createElement('div');
      header.setAttribute("class", "header");
      this.shadowRoot.appendChild(header);
      const wrapper = document.createElement('div');
      wrapper.setAttribute("class", "wrapper");
      header.appendChild(wrapper);
      const left = document.createElement('div');
      left.setAttribute("class", "left");
      wrapper.appendChild(left);
      const hamburgerMenu = document.createElement('div');
      hamburgerMenu.setAttribute("class", "hamburger-menu");
      left.appendChild(hamburgerMenu);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute("focusable", "false");
      svg.setAttribute("viewBox", "0 0 24 24");
      hamburgerMenu.appendChild(svg);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute("d", "M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z");
      svg.appendChild(path);
      const title = document.createElement('div');
      title.setAttribute("class", "title");
      left.appendChild(title);
      title.textContent = `用户列表`;
      const middle = document.createElement('div');
      middle.setAttribute("class", "middle");
      wrapper.appendChild(middle);
      const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg1.setAttribute("class", "svg");
      svg1.setAttribute("focusable", "false");
      svg1.setAttribute("height", "24px");
      svg1.setAttribute("viewBox", "0 0 24 24");
      svg1.setAttribute("width", "24px");
      svg1.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      middle.appendChild(svg1);
      const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path2.setAttribute("d", "M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z");
      svg1.appendChild(path2);
      const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path3.setAttribute("d", "M0,0h24v24H0V0z");
      path3.setAttribute("fill", "none");
      svg1.appendChild(path3);
      hamburgerMenu.addEventListener('click',this.navigate.bind(this))
    }
  }
  customElements.define('custom-header', CustomHeader);
  /*
  <!--
  <script type="module" src="./components/custom-header.js"></script>
  <custom-header bind="custommHeader" @submit="onCustommHeaderSubmit"></custom-header>
  customElements.whenDefined('custom-header').then(() => {
    custommHeader.data = []
  })
  -->
  */
})();