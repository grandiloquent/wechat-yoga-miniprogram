class CustomMiniAction extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style></style>
    <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;">
      <div style="width: 40px; height: 40px; border: 1px solid #dadce0; border-radius: 999rem; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #70757a;">
        <slot name="image">
        </slot>
      </div>
      <div style="font-size: 14px; font-weight: 500; line-height: 20px; margin: 12px 4px 0; color: #3c4043; text-align: center; overflow: hidden; text-overflow: ellipsis; vertical-align: top; white-space: normal;">
        <slot name="title">
        </slot>
      </div>
    </div>`;
    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
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
customElements.define('custom-mini-action', CustomMiniAction);
/*
<!--\
<custom-mini-action></custom-mini-action>
<script src="components/custom-mini-action.js"></script>
const customMiniAction = document.querySelector('custom-mini-action');
const customMiniAction = document.createElement('custom-mini-action');
customMiniAction.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customMiniAction);
-->
*/