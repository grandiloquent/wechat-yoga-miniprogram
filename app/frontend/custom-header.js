class CustomHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>
    .header {
        color: black;
        min-width: 320px;
        transition: box-shadow 250ms;
        top: 0;
        width: 100%;
        display: block;
        font: 13px/27px Roboto, Arial, sans-serif;
        z-index: 986;
        position: fixed;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 1);
    }

    .wrapper {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        transition: background-color .4s;
        padding: 4px;
        padding-left: 8px;
        min-width: 0;
    }

    .left {
        height: 48px;
        vertical-align: middle;
        white-space: nowrap;
        -webkit-box-align: center;
        align-items: center;
        display: flex;
        -webkit-user-select: none;
        box-sizing: border-box;
        padding-right: 14px;
        flex: 1 1 auto;
        overflow: hidden;
    }

    .middle {
        height: 48px;
        vertical-align: middle;
        white-space: nowrap;
        -webkit-box-align: center;
        align-items: center;
        display: flex;
        -webkit-user-select: none;
        justify-content: flex-end;
        flex: 0 0 auto;
    }

    .svg {
        fill: currentColor;
        opacity: 1;
        border-radius: 50%;
        padding: 8px;
        margin: 3px;
        color: unset;
        margin-left: 1px;
        margin-right: 1px;
    }
</style>





<div class="header">
    <div class="wrapper">
        <div class="left">
        </div>
        <div class="middle">
            <svg class="svg" focusable="false" height="24px" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.49,19l-5.73-5.73C15.53,12.2,16,10.91,16,9.5C16,5.91,13.09,3,9.5,3S3,5.91,3,9.5C3,13.09,5.91,16,9.5,16 c1.41,0,2.7-0.47,3.77-1.24L19,20.49L20.49,19z M5,9.5C5,7.01,7.01,5,9.5,5S14,7.01,14,9.5S11.99,14,9.5,14S5,11.99,5,9.5z"></path>
                <path d="M0,0h24v24H0V0z" fill="none"></path>
            </svg>
        </div>
    </div>
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
customElements.define('custom-header', CustomHeader);
/*
<!--\
<custom-header></custom-header>
<script src="custom-header.js"></script>

const customHeader = document.querySelector('custom-header');
customHeader.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customHeader = document.createElement('custom-header');
customHeader.setAttribute('title','');
document.body.appendChild(customHeader);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/