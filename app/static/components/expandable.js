class CustomExpandable extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});

        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `
        .wrapper
        {
            /*margin-bottom: 24px;*/
            display: flex;
            flex-direction: column;
            user-select: none;
        }
        .container
        {
            min-width: 296px;
            width: 100%;
            /*margin: 0 -16px 8px;*/
            padding: 0 16px;
            border-bottom: 8px solid #f1f3f4;
            box-sizing: border-box;
        }
        .inner
        {
            cursor: pointer;
            display: flex;
            outline: none;
            transition: background .2s .1s;
            -webkit-box-align: center;
            align-items: center;
            padding: 0;
                        
        }
        .content
        {
            -webkit-box-flex: 1;
            flex-grow: 1;
            flex-shrink: 1;
        }
        .button
        {
            color: rgba(0,0,0,.65);
            -webkit-box-flex: 0;
            flex-grow: 0;
            flex-shrink: 0;
            padding-left: 16px;
            width: 24px;
            position: relative;
            -webkit-user-select: none;
            margin: 0;
            display: flex;
        }
        .button>svg
        {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }
        .title
        {
            font-family: "Google Sans",Roboto,Arial,sans-serif;
            font-size: 1.125rem;
            font-weight: 400;
            letter-spacing: 0;
            line-height: 1.5rem;
            -webkit-box-align: center;
            align-items: center;
            margin-bottom: 0;
            margin-top: 0;
        }
        .subtitle
        {
            letter-spacing: .01428571em;
            font-family: Roboto,Arial,sans-serif;
            font-size: .875rem;
            font-weight: 400;
            line-height: 1.25rem;
            color: #5f6368;
            margin-top: 0;
            margin-bottom: 16px;
        }
        `;
        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        this.root.appendChild(wrapper);
        const container = document.createElement('div');
        container.setAttribute("class", "container");
        wrapper.appendChild(container);
        const inner = document.createElement('div');
        inner.setAttribute("class", "inner");
        container.appendChild(inner);
        const content = document.createElement('div');
        content.setAttribute("class", "content");
        inner.appendChild(content);
        const title = document.createElement('div');
        title.setAttribute("class", "title");
        content.appendChild(title);
        title.textContent = `周一`;
        const subtitle = document.createElement('div');
        subtitle.setAttribute("class", "subtitle");
        content.appendChild(subtitle);
        subtitle.textContent = `周一`;
        const button = document.createElement('div');
        button.setAttribute("class", "button");
        inner.appendChild(button);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewbox", "0 0 24 24");
        button.appendChild(svg);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", "M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z");
        svg.appendChild(path);
        const slot = document.createElement('slot');
        container.appendChild(slot);

        this.titleRender = title;
        this.subtitleRender = subtitle;
        this.button = button;
        this.svg = svg;
        this.inner = inner;
    }


    static get observedAttributes() {
        return ['title', 'subtitle'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        this.addEventListener('click', evt => {
            if (this.svg.dataset.expand === '1') {
                this.svg.dataset.expand = '0'
                this.svg.style = 'transition: transform .3s ease-in-out; transform: rotate(0deg)';
                this.inner.style.borderBottom = 'none';
            } else {
                this.svg.dataset.expand = '1'
                this.svg.style = 'transition: transform .3s ease-in-out; transform: rotate(180deg)';
                this.inner.style.borderBottom = '1px solid #e8eaed';
            }
            this.dispatchEvent(new CustomEvent('expand', {
                detail: this.svg.dataset.expand
            }));
        })
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'title') {
            this.titleRender.textContent = newVal;
        } else if (attrName === 'subtitle') {
            this.subtitleRender.textContent = newVal;
        }
    }

}

customElements.define('custom-expandable', CustomExpandable);
/*
<!--
<script src="expandable.js"></script>
<custom-expandable></custom-expandable>
const customCustomExpandable = document.querySelector('custom-expandable');
-->
*/