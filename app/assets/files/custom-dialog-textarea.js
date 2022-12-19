class CustomDialogTextarea extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.layout
{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    margin: 0 40px;
    padding: 0;
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
.overlay
{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    cursor: pointer;
    background-color: rgba(0,0,0,.8);
}
.dialog
{
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 16px 16px 10px;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 13px;
    color: #030303;
    background-color: #f9f9f9;
    border: none;
    min-width: 250px;
    max-width: 356px;
}
.dialog-body
{
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 300px;
    max-height: 100vh;
}
input, textarea
{
    background-color: transparent;
    padding-bottom: 4px;
    outline: none;
    box-sizing: border-box;
    border: none;
    border-radius: 0;
    margin-bottom: 1px;
    font: inherit;
    color: #030303;
}
textarea
{
    -webkit-appearance: none;
    appearance: none;
    min-height: 84px;
    width: 100%;
    border: 1px solid rgba(0,0,0,.1);
    padding: 8px;
}
.dialog textarea
{
    margin: 10px 0;
    resize: none;
}
.dialog-buttons
{
    display: flex;
    align-items: center;
    justify-content: flex-end;
}
.dialog-button
{/*margin: -.7em -.57em;*/
    min-width: 5.14em;
    font-size: 14px;
    line-height: 1em;
    padding: .7em .57em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
}</style>
    <div class="layout">
      <div class="dialog">
        <div class="dialog-body">
          <textarea></textarea>
        </div>
        <div class="dialog-buttons">
          <div class="dialog-button">
            取消
          </div>
          <div class="dialog-button" style="background-color: #065fd4; color: #fff; margin-left: .7em;">
            确认
          </div>
        </div>
      </div>
    </div>
    <div class="overlay">
    </div>`;
    }


    static get observedAttributes() {
        return ['title'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.querySelectorAll('.layout,.dialog-button:first-child')
            .forEach(x => {
                x.addEventListener('click', evt => {
                    this.root.host.remove();
                });
            });
        this.root.querySelector('.dialog-button:last-child')
            .addEventListener('click', evt => {
                this.root.host.remove();
                localStorage.setItem('template', this.root.querySelector('textarea').value)
            });
        this.root.querySelector('textarea').addEventListener('click', evt => {
            evt.stopPropagation();
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
customElements.define('custom-dialog-textarea', CustomDialogTextarea);
/*
<!--\
<custom-dialog-textarea></custom-dialog-textarea>
<script src="custom-dialog-textarea.js"></script>

const customDialogTextarea = document.querySelector('custom-dialog-textarea');
customDialogTextarea.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customDialogTextarea = document.createElement('custom-dialog-textarea');
customDialogTextarea.setAttribute('title','');
document.body.appendChild(customDialogTextarea);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/