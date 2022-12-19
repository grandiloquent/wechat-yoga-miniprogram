class CustomNavigationBar extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `
		<style>
        .layout-container{
            -webkit-user-select: none;
            display: block;
            height: 51px;
            overflow-y: hidden;
            padding: 0;
            position: relative;
            z-index: 1;
            -webkit-overflow-scrolling: touch;
            overflow-x: scroll;
            height: 36px;
            margin-left: -3px;
            margin-right: -3px;
            box-shadow: 0px 1px 3px 0px rgba(60, 64, 67, 0.08);
            padding-bottom: 8px;
        }
        .layout-container::-webkit-scrollbar{
            display: none;
        }
        .wrapper{
            position: relative;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            padding-right: 8px;
            padding-left: 11px;
            margin-left: -4px;
        }
        .item{
            display: inline-block;
            line-height: 27px;
            height: 28px;
            font-size: 14px;
            text-align: center;
            font-weight: 500;
            font-family: Roboto-Medium,Roboto-Regular,Roboto-Medium,HelveticaNeue-Medium,Helvetica Neue,sans-serif-medium,Arial,sans-serif;
            font-family: Google Sans,Roboto,Helvetica Neue,Arial,sans-serif
 
        }
        .item>a{
            color: rgba(0,0,0,0.54);
            text-decoration: none;
            display: inline-block;
            padding: 8px 12px 8px 12px;
            outline: 0;

        }
        .item> a:active {
            color: #202124
        }
        </style>
        <div class="layout-container">
        <div class="wrapper">
        <div class="item">
        <a href="notes.html?tag=null">全部</a>
        </div>
        </div>
		</div>
        `;
    }


    static get observedAttributes() {
        return ['items'];
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
        if (attrName === 'items') {
            const items = JSON.parse(newVal);
            const wrapper = this.root.querySelector('.wrapper');
            for (const iterator of items) {
                const div = document.createElement('div');
                div.className = 'item';
                const a = document.createElement('a');
                a.href = `notes.html?tag=${encodeURIComponent(iterator)}`
                a.textContent = iterator;
                div.appendChild(a);
                wrapper.appendChild(div);
            }

        }
    }

}
customElements.define('custom-navigation-bar', CustomNavigationBar);
/*
<!--\
<custom-navigation-bar></custom-navigation-bar>
<script src="custom-navigation-bar.js"></script>

const customNavigationBar = document.querySelector('custom-navigation-bar');
customNavigationBar.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customNavigationBar = document.createElement('custom-navigation-bar');
customNavigationBar.setAttribute('title','');
document.body.appendChild(customNavigationBar);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/