class CustomSearch extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.wrapper
{
    color: #4d5156;
    position: relative;
    overflow: visible;
    margin-bottom: 0;
    box-shadow: none;
    background: none;
    margin-top: -1px;
    margin-left: 16px;
    margin-right: 16px;
    padding-bottom: 4px;
}
.layout
{
    display: flex;
    height: 44px;
    margin-top: 0;
    z-index: 3;
    box-shadow: 0 2px 5px 0 rgba(60,64,67,.16);
    border-radius: 25px;
    background: #fff;
}
.search
{
    padding: 0 12px;
    background: transparent;
    border: none;
    margin-right: -1px;
    padding-right: 0;
    flex: 0 0 auto;
    outline: 0;
}
.icon
{
    color: #9aa0a6;
    display: inline-block;
    fill: currentColor;
    height: 24px;
    line-height: 24px;
    position: relative;
    width: 24px;
}
.input
{
    -webkit-text-size-adjust: none;
    line-height: 25px;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0 0 0 16px;
    font-size: 16px;
    font-family: Roboto,Helvetica Neue,Arial,sans-serif;
    color: rgba(0,0,0,.87);
    word-wrap: break-word;
    display: flex;
    flex: 1;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
    outline: 0;
}
.content
{
    flex: 1;
    display: flex;
    padding: 7px 0;
}
.right
{
    display: flex;
    flex: 0 0 auto;
    align-items: stretch;
    margin-right: -3px;
}
.clear
{
    -webkit-text-size-adjust: none;
    display: flex;
    flex: 1;
    color: #70757a;
    cursor: pointer;
    font: 27px/25px arial,sans-serif;
    align-items: center;
    padding: 0 12px;
    margin: 0 0;
    border: 0;
    background: transparent;
    outline: 0;
    visibility: hidden;
}</style>
    <div class="wrapper">
      <div class="layout">
        <button class="search">
          <div class="icon">
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
              </path>
            </svg>
          </div>
        </button>
        <div class="content">
          <input class="input" maxlength="2048" name="q" type="text" aria-autocomplete="list" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" tabindex="0" title="Google 搜索" aria-label="搜索" />
        </div>
        <div class="right">
          <button class="clear">
            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
              </path>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
    }

    static get observedAttributes() {
        return ['title'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        const input = this.root.querySelector('.input');
        input.addEventListener('input', evt => {
            if (input.value.length > 0) {
                clear.style.visibility = 'visible';
            } else {
                clear.style.visibility = 'hidden';
            }
        })
        const clear = this.root.querySelector('.clear');
        clear.addEventListener('click', evt => {
            input.value = "";
            clear.style.visibility = 'hidden';
            this.dispatchEvent(new CustomEvent('submit', {
                detail: ''
            }));
        })


        this.root.querySelector('.search').addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('submit', {
                detail: input.value
            }));
        })
        input.addEventListener('keydown', evt => {
            if (evt.key === "Enter") {
                this.dispatchEvent(new CustomEvent('submit', {
                    detail: input.value
                }));
            }
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
        if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        }
    }

}
customElements.define('custom-search', CustomSearch);
/*
<!--\
<custom-search></custom-search>
<script src="custom-search.js"></script>

const customSearch = document.querySelector('custom-search');
customSearch.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customSearch = document.createElement('custom-search');
customSearch.setAttribute('title','');
document.body.appendChild(customSearch);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/