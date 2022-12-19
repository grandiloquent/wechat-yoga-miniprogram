class CustomSubmitBar extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.close
{
    color: #1a73e8;
    padding: 0 24px;
    font-size: 14px;
    line-height: 32px;
    border-radius: 16px;
    flex-grow: 0;
}
.ok
{
    background: #1a73e8;
    color: #fff;
    padding: 0 24px;
    font-size: 14px;
    line-height: 32px;
    border-radius: 16px;
    flex-grow: 0;
    margin-left: 8px;
}</style>
    <div style="height: 68px; padding: 0 16px; position: fixed; bottom: 0; left: 0; right: 0; display: flex; box-shadow: 0 1px 2px 0 rgb(60 64 67/30%),0 2px 6px 2px rgb(60 64 67/15%); background: #fff;">
      <div style="flex: 1 1 auto;">
      </div>
      <div style="display: flex; align-items: center; justify-content: center;">
        <div class="close">
          取消
        </div>
        <div class="ok">
          确定
        </div>
      </div>
    </div>`;
        const ok = this.root.querySelector('.ok');
        ok.addEventListener('click', evt => {
            evt.stopPropagation();
            this.dispatchEvent(new CustomEvent('submit'));
        });
        const close = this.root.querySelector('.close');
        close.addEventListener('click', evt => {
            evt.stopPropagation();
            this.dispatchEvent(new CustomEvent('close'));
        });


    }


    static get observedAttributes() {
        return ['title'];
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
        if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        }
    }

}
customElements.define('custom-submit-bar', CustomSubmitBar);
/*
<!--\
<custom-submit-bar></custom-submit-bar>
<script src="custom-submit-bar.js"></script>
const customSubmitBar = document.querySelector('custom-submit-bar');
const customSubmitBar = document.createElement('custom-submit-bar');
customSubmitBar.setAttribute('title','');
document.body.appendChild(customSubmitBar);
-->
*/