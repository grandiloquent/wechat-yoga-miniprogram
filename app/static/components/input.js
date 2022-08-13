class CustomInput extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomInput.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());

        // const textarea = this.root.querySelector('textarea');
        // textarea.focus();
        // textarea.addEventListener('click', evt => {
        //     evt.stopPropagation();
        // });

        this.close = this.root.querySelector('#close');
        this.close.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
        });

        this.closeButton = this.root.querySelector('#close-button');
        this.closeButton.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
        });

        this.ok = this.root.querySelector('#ok');
        this.ok.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
            this.dispatchEvent(new CustomEvent('submit',
            //     {
            //     detail: textarea.value
            // }
            ));
        });


    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'text') {
            this.root.querySelector('textarea').value = newVal;
        }
    }

    static template() {
        return `
        ${CustomInput.style()}

    <div style="position: fixed; left: 0; top: 0; right: 0; bottom: 0; display: flex; background: #fff; flex-direction: column;">
      <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <div style="height: 48px; border-bottom: 1px solid #dadce0; width: 100%; display: flex;">
          <div style="flex-grow: 1;">
          </div>
          <div id="close-button" style="width: 48px; height: 48px;">
            <svg style="width: 24px; height: 24px; margin-top: 12px; margin-left: 12px;" viewBox="0 0 24 24">
              <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z">
              </path>
            </svg>
          </div>
        </div>
        <div style="flex-grow: 1;width: 100%">
          <slot>
          </slot>
        </div>
      </div>
      <div class="buttons">
        <div id="close" class="button" style="border-right: 1px solid #dadce0;">
          取消
        </div>
        <div id="ok" class="button">
          确定
        </div>
      </div>
    </div>
  
   `;
    }

    static style() {
        return `
        <style>
             .buttons{
border-top: 1px solid #dadce0; width: 100%; height: 56px; flex-shrink: 0; display: flex; align-items: center;
}
.button
{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    background-color: #fff;
    color: #1a73e8;
    height: 100%;
    width: 50%;
}

        </style>`;
    }


}

customElements.define('custom-input', CustomInput);
/*
<!--
<script src="input.js"></script>
<custom-input></custom-input>
const customCustomInput = document.querySelector('custom-input');
-->


*/