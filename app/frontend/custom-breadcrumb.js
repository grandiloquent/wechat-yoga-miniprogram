class CustomBreadcrumb extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>
    .breadcrumb-item {
        text-decoration: none;
        letter-spacing: .07272727em;
        font-family: Roboto, Arial, sans-serif;
        font-size: .6875rem;
        font-weight: 500;
        line-height: 1rem;
        text-transform: uppercase;
        color: #80868b;
        margin-right: 4px;

    }

    .breadcrumb-guillemet {

        letter-spacing: .07272727em;
        font-family: Roboto, Arial, sans-serif;
        font-weight: 500;
        line-height: 1rem;
        text-transform: uppercase;
        color: #80868b;
        margin-right: 4px;
        font-size: 12px;

    }
</style>

<div style="
            letter-spacing: .07272727em;
            font-family: Roboto,Arial,sans-serif;
            font-size: .6875rem;
            font-weight: 500;
            line-height: 1rem;
            text-transform: uppercase;
            display: flex;
            color: #202124;
            margin: 0;
            margin-top: 8px;
            ">
    <div class="breadcrumb-item">首页</div>
    <div class="breadcrumb-guillemet">
        <svg focusable="false" width="14" height="14" viewBox="0 0 24 24" style="fill:currentColor;flex-shrink:0">
            <path d="M7.59 18.59L9 20l8-8-8-8-1.41 1.41L14.17 12"></path>
        </svg>
    </div>
<div class="breadcrumb-item">文档</div>
</div>`;
    }


    static get observedAttributes() {
        return ['title'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';

        // this.dispatchEvent(new CustomEvent());
        /*
        const close = evt => {
                    evt.stopPropagation();
                    this.remove();
                };
                this.root.querySelectorAll('').forEach(x => {
                    x.addEventListener('click', close);
                })
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
        }
    }

}
customElements.define('custom-breadcrumb', CustomBreadcrumb);
/*
<!--\
<custom-breadcrumb></custom-breadcrumb>
<script src="custom-breadcrumb.js"></script>

const customBreadcrumb = document.querySelector('custom-breadcrumb');
customBreadcrumb.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customBreadcrumb = document.createElement('custom-breadcrumb');
customBreadcrumb.setAttribute('title','');
document.body.appendChild(customBreadcrumb);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/