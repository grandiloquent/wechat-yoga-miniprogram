class CustomButton extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>
    .button {
        font-size: .875rem;
        letter-spacing: .0107142857em;
        font-weight: 500;
        box-shadow: 0px 1px 2px 0px rgba(60, 64, 67, .30), 0px 1px 3px 1px rgba(60, 64, 67, .15);
        border-radius: 100px;
        height: 32px;
        padding: 0 16px 0 16px;
        width: 100%;
        color: #3c4043;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing:border-box;
    }

    .svg {
        color: rgb(26, 115, 232);
        width: 18px;
        fill: currentColor;
        flex-shrink: 0;
        margin-right: 8px
    }
</style>
<div class="button">
    <svg class="svg" focusable="false" viewBox="0 0 24 24">
        <path d="M18 16c-.79 0-1.5.31-2.03.81L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.53.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.48.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.05 4.12c-.05.22-.09.45-.09.69 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3zm0-12c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z">
        </path>
    </svg>
    分享
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
customElements.define('custom-button', CustomButton);
/*
<!--\
<custom-button></custom-button>
<script src="custom-button.js"></script>

const customButton = document.querySelector('custom-button');
customButton.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customButton = document.createElement('custom-button');
customButton.setAttribute('title','');
document.body.appendChild(customButton);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/