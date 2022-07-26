class CustomEditorMenu extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'open' });
    this.root.innerHTML = `<style>
  .menu-item {
    -webkit-box-direction: normal;
    color: #030303;
    padding: 0;
    height: 48px;
    display: flex;
    -webkit-box-align: center;
    align-items: center;
  }
  #overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    cursor: pointer;
    background-color: rgba(0, 0, 0, .6);
  }
  #hidden-button {
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
  .menu-item-button {
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
    font-size: 16px;
    line-height: 22px;
  }
  .layout {
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
  .header {
    overflow: hidden;
    -webkit-box-flex: 0;
    flex: none;
    border-bottom: 1px solid #fff;
  }
  .body {
    flex: 1;
    overflow-y: hidden;
    display: flex;
    flex-direction: column;
    color: #030303;
  }
  .button-clear {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #items {
    max-height: 288px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1px;
    background-color: #dadce0;
    border: 1px solid #dadce0;
  }
  #items::-webkit-scrollbar {
    display: none;
  }
  #items>div {
    font-size: 14px;
    line-height: 32px;
    background:#fff;
    text-align:center;
  }
</style>
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
    <div class="menu-item">
      <button class="menu-item-button">
        取消
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
    this.root.querySelectorAll('#overlay,.menu-item')
      .forEach(x => {
        x.addEventListener('click', evt => {
          this.root.host.remove();
        });
      });
    this.root.querySelectorAll('.menu-item')
      .forEach(x => {
        x.addEventListener('click', async evt => {
          this.dispatchEvent(new CustomEvent('submit', {
            detail: evt.currentTarget.dataset.index
          }));
        })
      })
    // this.dispatchEvent(new CustomEvent());
    /*
    this.dispatchEvent(new CustomEvent('submit', {
              detail: 0
          }));
          */
    const items = this.root.querySelector('#items');
    items.addEventListener('click', evt => {
      evt.stopPropagation();
    });
    const textarea = document.querySelector('textarea');
    let j = 0;
    `
             新建文件
             新建文件夹
             微信页面
             微信组件
             Web组件
             格式化JavaScript
             返回目录
             创建 Go Handler
             执行 SQL
             格式化微信样式
             `.split('\n')
      .map(x => {
        const s = x.trim();
        if (!s) return;
        const div = document.createElement('div');
        div.textContent = s;
        items.appendChild(div);
        div.addEventListener('click', async evt => {
          evt.stopPropagation();
          if (s === '新建文件') {
            await createNewFile(textarea, false);
          } else if (s === '新建文件夹') {
            await createNewFile(textarea, true);
          } else if (s === '微信页面') {
            await weChatPage(textarea, true);
          } else if (s === '微信组件') {
            await createWeChatComponents(textarea);
          } else if (s === '格式化JavaScript') {
            formattingJavaScript(textarea)
          } else if (s === '返回目录') {
            returnToParentDirectory();
          } else if (s === '创建 Go Handler') {
            await createNormalHandler(textarea);
          }else if (s === '执行 SQL') {
            await executeSQL(textarea);
          }else if (s === '格式化微信样式') {
            await formatWeChatStyle(textarea);
          }

          

          this.remove()

        });
        j++;
      });


  }
  disconnectedCallback() {
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'title') {
      this.root.querySelector('.title').textContent = newVal;
    }
  }
}
customElements.define('custom-editor-menu', CustomEditorMenu);
/*
<!--\
<custom-editor-menu></custom-editor-menu>
<script src="custom-editor-menu.js"></script>
const customEditorMenu = document.querySelector('custom-editor-menu');
customEditorMenu.addEventListener('submit', evt => {
            evt.stopPropagation();
        });
const customEditorMenu = document.createElement('custom-editor-menu');
customEditorMenu.setAttribute('title','');
document.body.appendChild(customEditorMenu);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/

/*
(() => {
  console.log([...new Array(11).keys()].map(x => {
    return `else if (ev.key === 'F${x + 1}') {
    onF${x + 1}Pressed(textarea);
    ev.preventDefault();
  }`
  }).join('\n'))
})();
(() => {
  console.log([...new Array(11).keys()].map(x => {
    return `function onF${x + 1}Pressed(textarea){

    }
    `
  }).join('\n'))
})();
(() => {
  console.log([...new Array(10).keys()].map(x => {
    return `else if (ev.key === '${x}') {
    onKey${x}Pressed(textarea);
    ev.preventDefault();
  }`
  }).join('\n'))
})();
*/

