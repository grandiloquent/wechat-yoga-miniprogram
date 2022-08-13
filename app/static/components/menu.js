class CustomMenu extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);
        this.container.innerHTML = CustomMenu.template();
    }

    static get observedAttributes() {
        return ['text'];
    }

    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        const close = this.root.querySelector('.close');
        close.addEventListener('click', evt => {
            evt.stopPropagation();
            this.style.display = 'none'
        });
    }

    insertItem(svg, title, callback) {
        const divider = this.root.querySelector('.divider');
        const div = document.createElement('div');
        div.innerHTML = `<div class="item">
          <div class="wrapper">
            <div class="item-container">
              <div class="img">
                ${svg}
              </div>
              <div class="text">
                ${title}
              </div>
            </div>
          </div>
        </div>`;
        div.addEventListener('click', callback);
        divider.insertAdjacentElement('beforebegin', div);
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'show') {
            this.root.querySelector('.wrapper').style.transform = 'translateX(250px)';
        }
    }

    static template() {
        return `
        ${CustomMenu.style()}
    <div class="container">
      <div class="menu">
<!--        <div class="item">-->
<!--          <div class="wrapper">-->
<!--            <div class="item-container">-->
<!--              <div class="img">-->
<!--                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">-->
<!--                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z">-->
<!--                  </path>-->
<!--                </svg>-->
<!--              </div>-->
<!--              <div class="text">-->
<!--                分享-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <div class="divider">
        </div>
        <div class="close">
          <div class="close-wrapper">
            <div style="color: #3c4043; cursor: pointer; display: block; position: relative; left: -8px;">
              <div class="text">
                关闭菜单
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   `;
    }

    static style() {
        return `
        <style>
.item-container
{
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    color: #3c4043;
    cursor: pointer;
    display: block;
    position: relative;
    left: -8px;
    outline: 0;
}
.item
{
    display: block;
    position: relative;

}
.disable{
    background-color: rgba(0,0,0,.1);
}
.wrapper
{
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 16px;
    vertical-align: middle;
    line-height: 48px;
}
.img
{
    display: inline-block;
    fill: currentColor;
    line-height: 24px;
    position: relative;
    padding: 8px;
    cursor: pointer;
    vertical-align: middle;
    height: 20px;
    width: 20px;
}
.text
{
    display: inline-block;
    font-size: 14px;
    min-width: 62px;
    vertical-align: middle;
    width: 100%;
}
.divider
{
    display: block;
    position: relative;
    border-top: 1px solid;
    height: 0;
    margin: 5px 0;
    border-top-color: #dadce0;
    pointer-events: none;
    cursor: default;
    color: rgba(0,0,0,.26) !important;
}
:host
{
    position: fixed;
}
.container
{
    display: block;
    border-radius: 8px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
    z-index: 1;/*left: 235px;*//*top: 1253px;*/
}
.menu
{
    border: none;
    display: block;
    white-space: nowrap;
    background-color: #fff;
    border-radius: 0;
    padding: 1px 0;
    outline: 0;
}
.close
{
    display: block;
    position: relative;
    outline: 0;
}
.close-wrapper
{
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 16px;
    vertical-align: middle;
    line-height: 48px;
}
        </style>`;
    }
}

customElements.define('custom-menu', CustomMenu);
/*
<!--
<script src="menu.js"></script>
<custom-menu></custom-menu>
const customCustomMenu = document.querySelector('custom-menu');
-->
*/