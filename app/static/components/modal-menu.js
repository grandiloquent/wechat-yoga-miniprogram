class CustomModalMenu extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    // static get observedAttributes() {
    //     return ['data'];
    // }


    connectedCallback() {
        
        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `<style>
        .menu-item-button
        {
            border: none;
            outline: none;
            font: inherit;
            color: inherit;
            background: transparent;
            cursor: pointer;
            box-sizing: border-box;
            display: block;
            font-size: 16px;
            padding: 9px 12px;
            text-align: initial;
            text-transform: unset;
            width: 100%;
        }
        .menu-item
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            color: #030303;
            display: block;
            padding: 3px 0;
        }
        .menu-content
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            position: relative;
            z-index: 2;
            max-height: 100%;
            overflow-y: auto;
            color: #030303;
            background-color: #f9f9f9;
            padding: 3px;
            min-width: 250px;
            max-width: 356px;
            margin: 40px;
        }
        .hidden-button
        {
            word-wrap: break-word;
            -webkit-text-size-adjust: 100%;
            padding: 0;
            border: none;
            outline: none;
            font: inherit;
            text-transform: inherit;
            color: inherit;
            background: transparent;
            cursor: pointer;
            position: fixed;
            top: 0;
            left: 0;
            height: 1px;
            width: 1px;
        }
        .c3-overlay
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            color: #030303;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            cursor: pointer;
            background-color: rgba(0,0,0,.8);
        }
        .menu-container
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            color: #030303;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            z-index: 4;
        }
      </style>
      <div class="menu-container">
      <div class="menu-content">
        <div class="menu-item">
          <div class="menu-item-button">
            取消
          </div>
        </div>
      </div>
      <div class="c3-overlay">
        <button class="hidden-button" aria-label="close">
        </button>
      </div>
    </div>
        `;
        const c3Overlay = this.root.querySelector('.c3-overlay');
        c3Overlay.addEventListener('click', evt => {
            this.remove();
        })
        const menuItem = this.root.querySelector('.menu-item:last-child');
        menuItem.addEventListener('click', evt => {
            this.remove();
        });
        const menuContent = this.root.querySelector('.menu-content');
        menuContent.insertAdjacentHTML('afterbegin',
            `        <div class="menu-item">
         <div class="menu-item-button">
           删除
         </div>
       </div>`);

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    // disconnectedCallback() {

    // }

    // attributeChangedCallback(attrName, oldVal, newVal) {
    //     if (attrName === 'data') {
    //         const obj = JSON.parse(newVal);
    //     }
    // }

}
customElements.define('custom-modal-menu', CustomModalMenu);
/*
<!--\
<custom-modal-menu></custom-modal-menu>
<script src="components/modal-menu.js"></script>
const customModalMenu = document.querySelector('custom-modal-menu');
const customModalMenu = document.createElement('custom-modal-menu');
customModalMenu.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customModalMenu);
-->
*/