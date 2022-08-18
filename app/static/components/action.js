class CustomAction extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomAction.template();


    }


    static get observedAttributes() {
        return ['head', 'subhead'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'head') {
            this.root.querySelector('#head').textContent = newVal;
        }
        if (attrName === 'subhead') {
            this.root.querySelector('#subhead').textContent = newVal;
        }
    }

    static template() {
        return `
        ${CustomAction.style()}
    <div style="border-top: solid 1px #dadce0; padding: 0 16px; height: 48px; align-items: center; color: #202124; display: flex; font-size: 14px; line-height: 20px;">
    <span id="head" style="flex-grow:1">
    </span>  
      <span id="subhead" style="color:#969799;margin-right:4px" >
      </span> 
    <div style="flex-shrink: 0;width: 20px; height: 20px;  color: #969799; fill: currentColor;">
    <svg style="width:100%;height:100%" viewBox="0 0 24 24">
    <path d="M5.859 4.125l2.156-2.109 9.984 9.984-9.984 9.984-2.156-2.109 7.922-7.875z"></path>
    </svg>
      </div>
      
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