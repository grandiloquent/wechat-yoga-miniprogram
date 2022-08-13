class CustomPopup extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
        .popup--top {
            top: 0;
            left: 0;
            width: 100%;
        }
        .popup
        {
            position: fixed;
            max-height: 100%;
            overflow-y: auto;
            background-color: #fff;
            transition: transform .3s,-webkit-transform .3s;
            
        }
        .overlay
        {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,.7);
            z-index: 2015;
        } 
      </style>
      <div class="overlay">
      </div>
      <div class="popup popup--top" style="height: 30%; z-index: 2016;display:none">
      </div>
		`;
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        const overlay = this.root.querySelector('.overlay');
        const popup = this.root.querySelector('.popup');

        overlay.addEventListener('click', evt => {
            if (popup.dataset.show === '1') {
                popup.style.transitionTimingFunction = 'ease-out';
                popup.style.transform = 'translate3d(0, -100%, 0)';
                popup.style.display = 'block';
                // requestAnimationFrame(() => {
                //     popup.style.transform = 'unset';
                // })
                popup.dataset.show='0'
            } else {
                popup.style.transitionTimingFunction = 'ease-out';
                popup.style.transform = 'translate3d(0, -100%, 0)';
                popup.style.display = 'block';
                requestAnimationFrame(() => {
                    popup.style.transform = 'unset';
                    popup.dataset.show='1'
                })
            }


            // setTimeout(() => {
            //     popup.style.display = 'block';
            //     popup.style.transitionTimingFunction = 'ease-out';
            //     popup.style.transform = 'translate3d(0, 0, 0)';
            // }, 300);"
        })

    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
        }
    }

}
customElements.define('custom-popup', CustomPopup);
/*
<!--\
<custom-popup></custom-popup>
<script src="components/popup.js"></script>
const customPopup = document.querySelector('custom-popup');
const customPopup = document.createElement('custom-popup');
customPopup.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customPopup);
-->
*/