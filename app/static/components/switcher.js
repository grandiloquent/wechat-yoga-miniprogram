class CustomSwitcher extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `
        .button
        {
            border: 1px solid #dadce0;
        }
        .left
        {
            padding: 6px 20px 6px 24px;
            border-bottom-left-radius: 100px;
            border-top-left-radius: 100px;
            border-right: 0;
        }
        .right
        {
            padding: 6px 24px 6px 20px;
            border-bottom-right-radius: 100px;
            border-top-right-radius: 100px;
        }
        .active
        {
            background-color: #e8f0fe;
            color: #1967d2;
        }
            `


        const div = document.createElement('div');
        div.style.lineHeight = "20px";
        div.style.alignItems = "center";
        div.style.display = "flex";
        div.style.fontSize = "14px";
        div.style.paddingLeft = "8px";
        this.root.appendChild(div);

        const first = document.createElement('div');
        first.className = "button left active";

        div.appendChild(first);


        const second = document.createElement('div');
        second.className = 'button right'
        div.appendChild(second);
        second.textContent = `下周`;

        this.first = first;
        this.second = second;
    }


    static get observedAttributes() {
        return ['first-name', 'next-name'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());

        this.first.addEventListener('click', evt => {
            if (this.first.className.indexOf('active') !== -1) return;
            this.second.className = 'button right';
            this.first.className = 'button left active';
            this.dispatchEvent(new CustomEvent('touch', {
                detail: 0
            }));
        });

        this.second.addEventListener('click', evt => {
            if (this.second.className.indexOf('active') !== -1) return;
            this.second.className = 'button right active';
            this.first.className = 'button left';
            this.dispatchEvent(new CustomEvent('touch', {
                detail: 1
            }));
        })
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'first-name') {
            this.first.textContent = newVal;
        } else if (attrName === 'second-name') {
            this.second.textContent = newVal;
        }
    }

}
customElements.define('custom-switcher', CustomSwitcher);
/*
<!--
<script src="components/switcher.js"></script>
<custom-switcher></custom-switcher>
const customSwitcher = document.querySelector('custom-switcher');
const customSwitcher = document.createElement('custom-switcher');
customSwitcher.setAttribute('',JSON.stringify(obj));
-->
*/