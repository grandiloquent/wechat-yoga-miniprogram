class CustomItemHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        const div = document.createElement('div');
        div.setAttribute("style", "user-select: none;border-bottom: 8px solid #f1f3f4");
        this.root.appendChild(div);
        const div1 = document.createElement('div');
        div1.setAttribute("style", "padding:16px;color: rgba(0,0,0,.87);font-size: 18px;height: 24px;line-height: 24px;");
        div.appendChild(div1);

        const slot = document.createElement('slot');
        div.appendChild(slot);

        this.content = div1;
        this.container = div;
    }


    static get observedAttributes() {
        return ['date', 'borderless', 'thin-border'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'date') {
            const date = new Date(parseInt(newVal) * 1000);
            this.content.textContent = `${date.getMonth() + 1}月${date.getDate()}日周${"日一二三四五六".split('')[date.getDay()]}`;
        } else if (attrName === 'borderless') {
            this.container.style.border = 'none';
        }else if (attrName === 'thin-border') {
            this.container.style.borderBottom = '1px solid #f1f3f4';
        }
    }

}

customElements.define('custom-item-header', CustomItemHeader);
/*
<!--
<script src="item-header.js"></script>
<custom-item-header></custom-item-header>
const customItemHeader = document.querySelector('custom-item-header');
const customItemHeader = document.createElement('custom-item-header');
customItemHeader.setAttribute('',JSON.stringify(obj));
-->
*/