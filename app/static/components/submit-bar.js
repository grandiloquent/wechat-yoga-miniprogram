class CustomSubmitBar extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `<style>.shadow
        {
            border-width: 0;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3),0 2px 6px 2px rgba(60,64,67,.15);
            height: 2px;
            left: 0;
            pointer-events: none;
            position: fixed;
            right: 0;
            transition: opacity .15s 0ms cubic-bezier(.4,0,.2,1);
            bottom: 68px;
            opacity: 1;
            z-index: 0;
        }
        .submit
        {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-width: 64px;
            font-size: 14px;
            letter-spacing: .15px;
            font-weight: 500;
            text-transform: none;
            height: 32px;
            padding: 0 24px 0 24px;
            border-radius: 16px;
            margin: 8px 0 8px 8px;
            background-color: #1a73e8;
            color: #fff;
        }
        .close
        {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-width: 64px;
            font-size: 14px;
            letter-spacing: .15px;
            font-weight: 500;
            text-transform: none;
            height: 32px;
            padding: 0 24px 0 24px;
            border-radius: 16px;
            margin-top: 8px;
            margin-bottom: 8px;
        }
        .right
        {
            text-size-adjust: 100%;
            -webkit-font-smoothing: auto;
            font: 400 14px/20px Roboto,Arial,sans-serif;
            letter-spacing: .2px;
            color: #70757a;
            -webkit-tap-highlight-color: transparent;
            display: flex;
        }
        .left
        {
            flex: 1 1 auto;
        }
        .wrapper
        {
            align-items: center;
            height: 68px;
            padding: 0 16px;
            display: flex;
            flex: 0 0 auto;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            background: #fff;
        }</style>
            <div class="shadow">
            </div>
            <div class="wrapper">
              <div class="left">
              </div>
              <div class="right">
                <div class="close">
                  取消
                </div>
                <div class="submit">
                  确认
                </div>
              </div>
            </div>
		`;
        this.close = this.root.querySelector('.close');
        this.close.addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('close'));
        })
        this.submit = this.root.querySelector('.submit');
        this.submit.addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('submit'));
        })

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
customElements.define('custom-submit-bar', CustomSubmitBar);
/*
<!--\
<custom-submit-bar></custom-submit-bar>
<script src="components/submit-bar.js"></script>
const customSubmitBar = document.querySelector('custom-submit-bar');
const customSubmitBar = document.createElement('custom-submit-bar');
customSubmitBar.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customSubmitBar);
-->
*/