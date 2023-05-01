(() => {
  class CustomActions extends HTMLElement {

    constructor() {
      super();
      this.attachShadow({
        mode: 'open'
      });
      const wrapper = document.createElement("div");
      wrapper.setAttribute("class", "wrapper");
      const style = document.createElement('style');
      style.textContent = `.item-name {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  margin: 12px 4px 0;
  color: #3c4043;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: top;
  white-space: normal;
}

.item-image {
  width: 40px;
  height: 40px;
  border: 1px solid #dadce0;
  border-radius: 999rem;
  display: flex;
  align-items: center;
  justify-content: center;
  fill: currentColor;
  color: #70757a;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

}

.wrapper {
  margin: 16px 20px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  row-gap: 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent
}`;
      this.wrapper = wrapper;
      this.shadowRoot.append(style, wrapper);
    }
    navigate(e) {
      const href = e.currentTarget.dataset.href;
      window.location = `./${href}.html`;
    }
    set data(value) {
      this.wrapper.insertAdjacentHTML('afterbegin', value.map(element => {
        return `<div bind class="item" data-href="${element.href}" @click="navigate">
  <div class="item-image">
    <svg viewBox="0 0 24 24" style="width:24px;height:24px;">
      ${element.path}
    </svg>
  </div>
  <div class="item-name">
    ${element.title}
  </div>
</div>`}).join(''));
      this.wrapper.querySelectorAll('[bind]').forEach(element => {
        if (element.getAttribute('bind')) {
          this[element.getAttribute('bind')] = element;
        }
        [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
          if (!attr.value) return;
          element.addEventListener(attr.nodeName.slice(1), evt => {
            this[attr.value](evt);
          });
        });
      })
    }

    connectedCallback() {
    }
    static get observedAttributes() {
      return ['title'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
    }
  }
  customElements.define('custom-actions', CustomActions);
  /*
  <!--
  <script type="module" src="./components/custom-actions.js"></script>
  <custom-actions></custom-actions>
  customElements.whenDefined('custom-actions').then(() => {
    customActions.data = []
  })
  -->
  */
})();
customActions.data = [{
  path: ` <path d="M0 0h24v24H0V0z" fill="none"></path>
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z">
        </path>`,
  title: '课程',
  href: 'lessons'
},
{
  path: `<path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z">
        </path>`,
  title: '课表',
  href: 'image'
}, {
  path: `<path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />`,
  title: '会员',
  href: 'users'
}, {
  path: `<path d="M20.016 8.016v-2.016h-16.031v2.016h16.031zM20.016 18v-6h-16.031v6h16.031zM20.016 3.984q0.844 0 1.406 0.586t0.563 1.43v12q0 0.844-0.563 1.43t-1.406 0.586h-16.031q-0.844 0-1.406-0.586t-0.563-1.43v-12q0-0.844 0.563-1.43t1.406-0.586h16.031z"></path>
`,
  title: '会员卡',
  href: 'cards'
}, {
  path: `<path d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z">
        </path>`,
  title: '设置',
  href: 'settings'
}
];

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/login`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  if (response.status > 399 || response.status < 200) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return response.text();
}
async function render() {
  try {
    await loadData();

  } catch (error) {
    console.log(error);
    window.location = `/backend/login?returnUrl=${encodeURIComponent(window.location.href)}`
  }
}
render();

