class CustomDialog extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'closed' });

        this.root.innerHTML = `<style>.button
{
    margin-top: 8px;
    padding: 0 24px;
    min-width: 64px;
    font-size: 14px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #174ea6;
    position: relative;
}
.button-background
{
    background: #1a73e8;
    border-radius: 16px;
    opacity: .04;
    position: absolute;
    top: 0;
    right: 12.5%;
    left: 12.5%;
    bottom: 0;
}
.space
{
    flex-grow: 1;
    height: 3em;
}
.layout
{
    background-color: rgba(0,0,0,.502);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 5000;
    transition: opacity .05s cubic-bezier(.4,0,.2,1);
    opacity: 1;
}
.title
{
    flex-grow: 2;
    flex-shrink: 2;
    display: block;
    font: 400 15px/24px Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
    padding: 0 24px;
    overflow-y: auto;
    position: relative;
    padding-top: 24px;
}
.buttons
{
    display: flex;
    flex-shrink: 0;
    -webkit-box-pack: end;
    justify-content: flex-end;
    padding: 24px 24px 16px 24px;
}
.top
{
    flex-shrink: 1;
    max-height: 100%;
    -webkit-box-align: stretch;
    align-items: stretch;
    display: flex;
    -webkit-box-orient: vertical;
    flex-direction: column;
    transition: transform .225s cubic-bezier(0,0,.2,1),-webkit-transform .225s cubic-bezier(0,0,.2,1);
    position: relative;
    background-color: #fff;
    box-shadow: 0 12px 15px 0 rgba(0,0,0,.24);
    max-width: 24em;
    outline: 1px solid transparent;
    overflow: hidden;
    border-radius: 8px;
}
.wrapper
{
    -webkit-tap-highlight-color: transparent;
    transition: transform .4s cubic-bezier(.4,0,.2,1),-webkit-transform .4s cubic-bezier(.4,0,.2,1);
    -webkit-box-align: center;
    align-items: center;
    display: flex;
    -webkit-box-orient: vertical;
    flex-direction: column;
    bottom: 0;
    left: 0;
    padding: 0 5%;
    position: absolute;
    right: 0;
    top: 0;
}</style>
    <div class="layout">
      <div class="wrapper">
        <div class="space">
        </div>
        <div class="top">
          <div class="title">
            您要删除吗？
          </div>
          <div class="buttons">
            <div class="button">
              <div class="button-background">
              </div>
              舍弃
            </div>
            <div class="button">
              确定
            </div>
          </div>
        </div>
        <div class="space">
        </div>
      </div>
    </div>`;
        const layout = this.root.querySelector('.layout');
        layout.addEventListener('click', evt => {
            this.remove();
        })
        const top = this.root.querySelector('.top');
        top.addEventListener('click', evt => {
            evt.stopPropagation();
        })
        const button = this.root.querySelector('.button');
        button.addEventListener('click', evt => {
            this.remove();
        })
        this.root.querySelector('.button:last-child').addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('submit'))
        })


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
customElements.define('custom-dialog', CustomDialog);
/*
<!--\
<custom-dialog></custom-dialog>
<script src="custom-dialog.js"></script>

const customDialog = document.createElement('custom-dialog');
customDialog.addEventListener('submit', evt => {
    evt.stopPropagation();
    customDialog.remove();
});
customDialog.setAttribute('title', `您确定要删除 ${} 的预约吗？`)
document.body.appendChild(customDialog);
-->
*/

