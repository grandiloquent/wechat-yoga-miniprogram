class CustomAction extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomAction.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'show') {
            this.root.querySelector('.wrapper').style.transform = 'translateX(250px)';
        }
    }

    static template() {
        return `
        ${CustomAction.style()}
    <div style="border-top: solid 1px #dadce0; padding: 0 16px; height: 48px; align-items: center; color: #202124; display: flex; font-size: 14px; line-height: 20px;">
      <div style="flex-shrink: 0;width: 24px; height: 24px; margin-right: 24px; color: #1a73e8; fill: currentColor;">
        <slot name="svg">
        </slot>
      </div>
      <slot name="text">
      </slot>
    </div>
   `;
    }

    static style() {
        return `
        <style>
       
        </style>`;
    }


}

customElements.define('custom-action', CustomAction);
/*
<!--
<script src="action.js"></script>
<custom-action></custom-action>
const customCustomAction = document.querySelector('custom-action');
-->
*/