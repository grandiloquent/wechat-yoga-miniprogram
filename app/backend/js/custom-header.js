class CustomHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.title
{
    line-height: 36px;
    font-size: 32px;
    color: #666;
}</style>
    <header style="position: fixed; top: 0; left: 0; right: 0; background: #fff; box-shadow: 0 1px 2px 0 rgb(60 64 67/30%),0 2px 6px 2px rgb(60 64 67/15%); z-index: 1;">
      <!-- Toolbar -->
      <div style="display: block; height: 64px; position: relative; width: 100%;">
        <div style="color: #1558d6; text-decoration: none; -webkit-tap-highlight-color: rgba(0,0,0,.1); padding: 16px 0 14px; position: absolute; left: 50%; margin-left: -46px; outline: 0;">
          <div class="title">
          </div>
        </div>
      </div>
      <!-- Toolbar -->
      <slot>
      </slot>
    </header>`;
    }


    static get observedAttributes() {
        return ['title', 'flat'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        } else if (attrName === 'flat') {
            const header=this.root.querySelector('header');
            header.style.boxShadow = 'none';
            header.style.borderBottom='1px solid #dadce0';
        }
    }

}
customElements.define('custom-header', CustomHeader);
/*
<!--\
<custom-header></custom-header>
<script src="custom-header.js"></script>
const customHeader = document.querySelector('custom-header');
const customHeader = document.createElement('custom-header');
customHeader.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customHeader);
-->
*/