class CustomDialogRename extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.dialog-container
{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    z-index: 4;
    margin: 0 40px;
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
}
.modern-overlay
{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    cursor: pointer;
    background-color: rgba(0,0,0,.1);
}
.dialog
{
    position: relative;
    z-index: 2;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    max-height: 100%;
    box-sizing: border-box;
    padding: 16px;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
    font-size: 1.3rem;
    color: #0f0f0f;
    border: none;
    width: 356px;
    box-shadow: 0 0 24px 12px rgba(0,0,0,.25);
    border-radius: 12px;
    background-color: #fff;
}
.dialog-header
{
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    flex-shrink: 0;
}
.h2
{
    margin: 0 0 3px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    max-height: 2.5em;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 1.25;
    text-overflow: ellipsis;
    font-weight: normal;
    font-size: 1.8rem;
}
.dialog-body
{
    overflow-y: auto;
    overflow-x: hidden;
    max-height: 100vh;
}
.dialog-buttons
{
    flex-shrink: 0;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: end;
    justify-content: flex-end;
    margin-top: 12px;
}
.button
{
    outline: none;
    font: inherit;
    position: relative;
    margin: 0;
    white-space: nowrap;
    min-width: 0;
    text-transform: none;
    font-weight: 500;
    border: none;
    cursor: pointer;
    outline-width: 0;
    box-sizing: border-box;
    background: none;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    height: 36px;
    font-size: 14px;
    line-height: 36px;
    border-radius: 18px;
    color: #0f0f0f;
}
input
{
    background-color: rgba(0,0,0,.05);
    border-radius: 32px;
    box-sizing: border-box;
    font: inherit;
    color: #0f0f0f;
    text-overflow: ellipsis;
    -webkit-box-flex: 1;
    flex-grow: 1;
    margin: 0;
    font-size: 12px;
    font-weight: normal;
    width: 100%;
    margin-top: 4px;
    border: none;
    padding: 7px 12px;
    outline: none;
}</style>
    <div class="dialog-container">
      <div class="dialog">
        <div class="dialog-header">
          <div class="h2">
            重命名
          </div>
        </div>
        <div class="dialog-body">
          <input />
        </div>
        <div class="dialog-buttons">
          <button class="button">
            取消
          </button> <button class="button" style="color: #909090;">继续
          </button>
        </div>
      </div>
      <div class="modern-overlay">
      </div>
    </div>`;
    }

    static get observedAttributes() {
        return ['value', "title"];
    }


    connectedCallback() {

        this.root.querySelector('.modern-overlay').addEventListener('click', evt => {
            this.remove();
        })
        this.root.querySelector('button:first-child').addEventListener('click', evt => {
            this.remove();
        })
        this.root.querySelector('button:last-child').addEventListener('click', evt => {
            this.remove();
            this.dispatchEvent(new CustomEvent('submit', {
                detail: this.root.querySelector('input').value
            }));
        })

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
        const input = this.root.querySelector('input');
        input.addEventListener('keydown', evt => {
            if (evt.key === 'F1') {
                evt.preventDefault();
                input.value = `${input.value.substring(0, input.selectionStart)}.${substringAfterLast(input.value,".")}`;
            }
        })
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'value') {
            this.root.querySelector('input').value = newVal;
        } else if (attrName === 'title') {
            this.root.querySelector('.h2').textContent = newVal;
        }
    }

}
customElements.define('custom-dialog-rename', CustomDialogRename);
/*
<!--\
<custom-dialog-rename></custom-dialog-rename>
<script src="custom-dialog-rename.js"></script>

const customDialogRename = document.querySelector('custom-dialog-rename');
customDialogRename.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customDialogRename = document.createElement('custom-dialog-rename');
customDialogRename.setAttribute('title','');
document.body.appendChild(customDialogRename);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/
function substringAfterLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(index + delimiter.length);
    }
}