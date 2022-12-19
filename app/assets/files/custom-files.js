class CustomFiles extends HTMLElement {

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    this.root.innerHTML = `<style>.menu-item
{
    -webkit-box-direction: normal;
    color: #030303;
    padding: 0;
    height: 48px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
}
#overlay
{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    cursor: pointer;
    background-color: rgba(0,0,0,.6);
}
#hidden-button
{
    word-wrap: break-word;
    -webkit-text-size-adjust: 100%;
    padding: 0;
    border: none;
    outline: none;
    font: inherit;
    text-transform: inherit;
    color: inherit;
    background: transparent;
    cursor: pointer;
    position: fixed;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
}
.menu-item-button
{
    border: none;
    outline: none;
    font: inherit;
    color: inherit;
    background: transparent;
    cursor: pointer;
    box-sizing: border-box;
    text-align: initial;
    text-transform: unset;
    width: 100%;
    display: flex;
    padding: 0;
    margin-left: 12px;
    font-size: 1.6rem;
    line-height: 2.2rem;
}
.layout
{
    border-radius: 12px;
    background-color: #fff;
    display: block;
    overflow: hidden;
    position: fixed;
    margin: 0 8px 24px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
}
.header
{
    overflow: hidden;
    -webkit-box-flex: 0;
    flex: none;
    border-bottom: 1px solid #fff;
}
.body
{
    flex: 1;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    color: #030303;
}
.button-clear
{
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.grid
{
    display: grid;
    grid-template-columns: repeat(2,1fr);
    background: #dadce0;
    gap: 1px;
    border-top: 1px solid #dadce0;
}
.grid>div
{
    background: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
#items
{
    max-height: 154px;
    overflow-y: auto;
}
#items::-webkit-scrollbar
{
    display: none;
}</style>
    <div id="overlay">
      <button id="hidden-button">
      </button>
    </div>
    <div class="layout">
      <div class="header">
        <div style="background: #030303; opacity: .15; border-radius: 4px; height: 4px; margin: 0 auto; width: 40px; margin-top: 8px;">
        </div>
        <div style="-webkit-box-pack: justify; justify-content: space-between; display: flex; margin-top: 8px;">
        </div>
      </div>
      <div class="body">
        <div id="items">
        </div>
        <div class="menu-item grid">
          <div>
            取消
          </div>
          <div>
            确认
          </div>
        </div>
      </div>
    </div>`;
    const overlay = this.root.querySelector('#overlay');
    overlay.addEventListener('click', evt => {
      this.remove();
    })
    const closeAction = this.root.querySelector('.grid>div:first-child');
    closeAction.addEventListener('click', evt => {
      this.remove();
    })
    this.root.querySelector('.grid>div:last-child').addEventListener('click', evt => {
      this.remove();
      this.dispatchEvent(new CustomEvent('submit'));
    })


    const files = localStorage.getItem('files');

    const items = (files && JSON.parse(files)) || null;
    const is = this.root.querySelector('#items');
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      const menuItem = document.createElement('div');
      menuItem.setAttribute("class", "menu-item");
      menuItem.setAttribute("data-src", "${encodeURIComponent(element)}");
      this.root.appendChild(menuItem);
      const deleteAction = document.createElement('button');
      deleteAction.setAttribute("id", "delete-action");
      deleteAction.setAttribute("class", "menu-item-button");
      menuItem.appendChild(deleteAction);
      deleteAction.textContent = `${substringAfterLast(element, "/")}`;

      const buttonClear = document.createElement('div');
      buttonClear.setAttribute("class", "button-clear");

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      svg.setAttribute("height", "24px");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("width", "24px");
      svg.setAttribute("fill", "#000000");
      buttonClear.appendChild(svg);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute("d", "M0 0h24v24H0V0z");
      path.setAttribute("fill", "none");
      svg.appendChild(path);
      const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path1.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z");
      svg.appendChild(path1);
      menuItem.appendChild(buttonClear);

      buttonClear.addEventListener('click', evt => {
        evt.stopPropagation();
        localStorage.setItem('files', JSON.stringify(
          JSON.parse(
            localStorage.getItem('files')
          ).filter(x => x !== element)
        ));
        menuItem.remove();
      });


      is.appendChild(menuItem);
    }


  }


  static get observedAttributes() {
    return ['data'];
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
    if (attrName === 'data') {
      const obj = JSON.parse(newVal);
    }
  }

}
customElements.define('custom-files', CustomFiles);
/*
<!--\
<custom-files></custom-files>
<script src="custom-files.js"></script>
const customFiles = document.querySelector('custom-files');
const customFiles = document.createElement('custom-files');
customFiles.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customFiles);
-->
*/