class CustomSectionHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.header {
            display: flex;
            align-items: center;
            margin: 16px 0;
            color: #969799;
            font-size: 14px;
            line-height: 24px;
        }`;
        const header = document.createElement('div');
        header.setAttribute("class", "header");
        this.root.appendChild(header);
        const div = document.createElement('div');
        div.style.height = "1px";
        div.style.background = "#ebedf0";
        div.style.marginRight = "16px";
        div.style.flex = "1";
        header.appendChild(div);
        const img = document.createElement('img');
        img.style.width = "20px";
        img.style.height = "20px";
        img.style.marginRight = "9px";
        header.appendChild(img);
        const span = document.createElement('span');
        header.appendChild(span);
        span.textContent = this.title;
        const div1 = document.createElement('div');
        div1.style.height = "1px";
        div1.style.background = "#ebedf0";
        div1.style.flex = "1";
        div1.style.margin = "0 0 0 16px";
        header.appendChild(div1);
        this.img = img;

    }


    static get observedAttributes() {
        return ['src'];
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
        if (attrName === 'src') {
            this.img.setAttribute("src", newVal);
        }
    }

}
customElements.define('custom-section-header', CustomSectionHeader);
/*
<!--\
<custom-section-header></custom-section-header>
<script src="components/section-header.js"></script>
const customSectionHeader = document.querySelector('custom-section-header');
const customSectionHeader = document.createElement('custom-section-header');
customSectionHeader.setAttribute('',JSON.stringify(obj));
-->
*/