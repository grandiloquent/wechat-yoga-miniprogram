(() => {
  class CustomDrawer extends HTMLElement {
    static get observedAttributes() {
      return ['expand'];
    }
    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      const style = document.createElement('style');
      style.textContent = `.name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .main {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
  }
  
  .overlay {
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 991;
    cursor: pointer;
  }
  
  .top {
    position: relative;
    top: 2px;
    -webkit-user-select: none;
    min-height: 48px;
    display: table-cell;
    height: 48px;
    vertical-align: middle;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 16px;
  }
  
  .item {
    text-decoration: none;
    letter-spacing: .01785714em;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.25rem;
    height: 48px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding-left: 24px;
    padding-right: 12px;
    margin-right: 8px;
    border-radius: 0 50px 50px 0;
    cursor: pointer;
    color: inherit;
  }
  
  .wrapper {
    background-color: #fff;
    bottom: 0;
    color: #000;
    overflow-x: hidden;
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 992;
    will-change: visibility;
    display: flex;
    flex-direction: column;
  }
  
  .divider {
    border-bottom: 1px solid #e8eaed;
    margin: 8px 8px 8px 0;
  }
  
  .expand {
    transform: translateX(0);
    visibility: visible;
    box-shadow: 0 0 16px rgba(0, 0, 0, .28);
    transition: transform .25s cubic-bezier(0.4, 0.0, 0.2, 1), visibility 0s linear 0s;
    overflow-y: visible;
    width: 256px;
  }
  
  .collapse {
    transition: transform .25s cubic-bezier(0.4, 0.0, 0.2, 1), visibility 0s linear .25s;
    transform: translateX(-264px)
  }`;
      this.shadowRoot.appendChild(style);
    }

    set data(value) {
      value.map(element => {
        const item = document.createElement('a');
        item.setAttribute("class", "item");
        item.setAttribute("href", element.href);
        this.main.appendChild(item);
        const div = document.createElement('div');
        div.style.width = "24px";
        div.style.height = "24px";
        div.style.fill = "currentColor";
        div.style.color = "#333";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.justifyContent = "center";
        div.style.marginRight = "16px";
        item.appendChild(div);

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewBox", "0 0 24 24");

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", element.d);
        svg.appendChild(path);
        div.appendChild(svg);

        const name = document.createElement('div');
        name.setAttribute("class", "name");
        item.appendChild(name);
        name.textContent = `${element.name}`;
      })

    }
    connectedCallback() {
      const wrapper = document.createElement('div');
      // collapse
      wrapper.setAttribute("class", "wrapper expand");
      this.shadowRoot.appendChild(wrapper);
      const top = document.createElement('div');
      top.setAttribute("class", "top");
      wrapper.appendChild(top);
      const main = document.createElement('div');

      main.setAttribute("class", "main");
      wrapper.appendChild(main);
      const overlay = document.createElement('div');
      overlay.setAttribute("class", "overlay");
      this.shadowRoot.appendChild(overlay);
      this.wrapper = wrapper;
      this.main = main;
      this.overlay = overlay;
      overlay.addEventListener('click', evt => {
        this.wrapper.className = "wrapper collapse";
        overlay.style.display = 'none';
      })
      this.data = [{
        d: `M9.984 20.016h-4.969v-8.016h-3l9.984-9 9.984 9h-3v8.016h-4.969v-6h-4.031v6z`,
        name: "首页",
        href: "/backend/index"
      }];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === 'expand') {
        if (newValue === 'true') {
          this.wrapper.className = "wrapper expand";
          this.overlay.style.display = 'block';
        } else {
          this.wrapper.className = "wrapper collapse";
          this.overlay.style.display = 'none';
        }
      }
    }

  }
  customElements.define('custom-drawer', CustomDrawer);
  /*
  <!--
  <script type="module" src="./components/custom-drawer.js"></script>
  <custom-drawer bind="custommDrawer" @submit="onCustommDrawerSubmit"></custom-g>
  customElements.whenDefined('custom-drawer').then(() => {
    custommDrawer.data = []
  })
  -->
  */
})();