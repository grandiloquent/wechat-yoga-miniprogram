class CustomStickHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';

        this.root.innerHTML = `<div style="display:flex;align-items: center;height: 64px;justify-content: center;background:#fff">
       <div style="position: absolute;left: 4px;font-size: 24px;width: 48px;height: 48px;padding: 12px;fill: currentColor;display:flex;align-items: center;justify-content: center;color:rgb(95, 99, 104)">
       <svg width="24" height="24" viewBox="0 0 24 24" focusable="false"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
       </div>
       <div class="title">其她</div>
        </div>
        `;
    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
        }
    }

}
customElements.define('custom-stick-header', CustomStickHeader);
/*
<!--\
<custom-stick-header></custom-stick-header>
<script src="components/stick-header.js"></script>
const customStickHeader = document.querySelector('custom-stick-header');
const customStickHeader = document.createElement('custom-stick-header');
customStickHeader.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customStickHeader);
-->
*/