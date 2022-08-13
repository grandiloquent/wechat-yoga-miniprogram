class CustomShadow extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';

        this.root.innerHTML = `<style>
        .shadow
        {
            border-width: 0;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3),0 2px 6px 2px rgba(60,64,67,.15);
            height: 2px;
            left: 0;
            opacity: 0;
            pointer-events: none;
            position: absolute;
            right: 0;
            transition: opacity .15s 0ms cubic-bezier(.4,0,.2,1);
        }
</style>
<div class="shadow">
</div>`;
    }


    static get observedAttributes() {
        return ['show', 'hide'];
    }


    connectedCallback() {
        this.shadow = this.root.querySelector('.shadow');
        this.shadow.style.top = '-2px';
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
        if (attrName === 'show') {
            this.shadow.style.opacity = '1';
        } else if (attrName === 'hide') {
            this.shadow.style.opacity = '0';
        }
    }

}
customElements.define('custom-shadow', CustomShadow);
/*
<!--\
<custom-shadow></custom-shadow>
<script src="components/shadow.js"></script>
const customShadow = document.querySelector('custom-shadow');
const customShadow = document.createElement('custom-shadow');
customShadow.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customShadow);
-->
*/