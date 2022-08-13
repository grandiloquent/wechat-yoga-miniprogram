class CustomOptions extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
        .active{
            background:#e8f0fe!important;
            color:#1967d2!important;
        }
        .container
        {
            padding: 0 24px;
            font-size: 14px;
            line-height: 20px;
            margin: 24px 0 12px;
        }
        .grid
        {
            display: grid;
            grid-template-columns: repeat(2,1fr);
            gap: 1px;
            background-color: #dadce0;
            border: 1px solid #dadce0;
            border-radius: 8px;
            overflow: hidden;
        }
        .item
        {
            background: #fff;
        }
        .item-wrapper
        {
            padding: 12px 8px 8px;
            text-align: center;
        }</style>
            <div class="container">
              <div class="grid">
              </div>
            </div>
		`;
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        this.grid = this.root.querySelector('.grid');


    }
    populateData(obj, selected) {
        obj.forEach((x, k) => {
            const item = `<div data-value="${x}" class="item">
        <div class="item-wrapper">
            <div>${x}</div>
        </div>
    </div>`;
            this.grid.insertAdjacentHTML('afterbegin', item);
        })
        this.items = this.root.querySelectorAll('.item');

        this.items.forEach(item => {
            item.addEventListener('click', evt => {
                const element = evt.currentTarget;
                this.items.forEach(v => {
                    if (element !== v) {
                        v.classList.remove('active');
                    } else
                        element.classList.add('active');
                });
                this.dispatchEvent(new CustomEvent('submit', {
                    detail: element.dataset.value
                }));
            })
        })
        
        this.items.forEach(v => {
            if (v.dataset.value === selected) {
                v.classList.add('active');
                return;
            }
        });
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
        }
    }

}
customElements.define('custom-options', CustomOptions);
/*
<!--\
<custom-options></custom-options>
<script src="components/options.js"></script>
const customOptions = document.querySelector('custom-options');
const customOptions = document.createElement('custom-options');
customOptions.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customOptions);
-->
*/