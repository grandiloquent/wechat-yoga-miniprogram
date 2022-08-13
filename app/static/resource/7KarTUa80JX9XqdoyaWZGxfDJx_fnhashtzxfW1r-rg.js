class CustomToast extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
    }
    // Fires when an instance of the element is created or updated
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'open'
        });
        const style = document.createElement('style');
        style.textContent = CustomToast.getStyle();
        this.root.appendChild(style);
        const c3Toast = document.createElement('DIV');
        c3Toast.setAttribute('class', 'c3-toast');

        const notificationActionRenderer = document.createElement('DIV');
        notificationActionRenderer.setAttribute('class', 'notification-action-renderer');
        const notificationActionResponseText = document.createElement('DIV');
        notificationActionResponseText.setAttribute('class', 'notification-action-response-text');
        notificationActionRenderer.appendChild(notificationActionResponseText);
        c3Toast.appendChild(notificationActionRenderer);
        this.root.appendChild(c3Toast);

        this.c3Toast = c3Toast;
        this.notificationActionResponseText = notificationActionResponseText;
        this.messages = [];
        this.timer = 0;
    }

    // Fires when an instance was inserted into the document
    connectedCallback() {}

    // Fires when an instance was removed from the document
    disconnectedCallback() {}

    showMessage() {
        if (this.messages.length && !this.showing) {
            const message = this.messages.shift();
            this.notificationActionResponseText.textContent = message;
            this.c3Toast.setAttribute('dir', 'in');
            this.showing = true;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.c3Toast.setAttribute('dir', 'out');
                setTimeout(() => {
                    this.showing = false;
                    this.showMessage();
                }, 195);
            }, 3000);
        }
    }
    // Fires when an attribute was added, removed, or updated
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'message') {
            this.messages.push(newVal);
            this.showMessage();
        }
    }

    // Fires when an element is moved to a new document
    adoptedCallback() {}
    static getTemplate(value) {
        return `
        ${CustomToast.getStyle()}
        <div>
            ${value}
        </div>
        `;
    }
    static getStyle() {
        return `
        .c3-toast[dir="in"] {
            transition: margin 225ms cubic-bezier(0.0, 0.0, 0.2, 1);
            margin-bottom: 0;
        }
        
        .c3-toast[dir="out"] {
            transition: margin 195ms cubic-bezier(0.4, 0.0, 1, 1);
        }
        
        .c3-toast {
            display: block;
            position: fixed;
            z-index: 4;
            left: 0;
            right: 0;
            bottom: 0;
            box-sizing: border-box;
            padding: 14px 24px;
            font-size: 1.4rem;
            color: #ffffff;
            background: hsl(0, 0%, 20%);
            will-change: transform;
            margin-bottom: -100%;
        }
        
        .notification-action-renderer {
            display: flex;
            align-items: center;
        }
        
        .notification-action-response-text {
            flex-grow: 1;
            padding-right: 1rem;
            font-size:14px;
        }
        
        `;
    }
}
customElements.define('custom-toast', CustomToast);

/*
<!--
<custom-toast id="toast"></custom-toast>
<script src="components/toast.js"></script>
document.getElementById('toast').setAttribute('message','成功');
-->
*/
class CustomSearch extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomSearch.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        const closeButton = this.root.querySelector('.close-button');
        closeButton.style.display = 'none';
        closeButton.addEventListener('click', evt => {
            input.value = '';
            closeButton.style.display = 'none';
        });
        const input = this.root.querySelector('input');
        input.addEventListener('input', evt => {
            if (input.value.length) {
                closeButton.style.display = 'block';
            }
        });
        input.addEventListener('keydown', evt => {
            if (evt.key === 'Enter') {
                this.dispatchEvent(new CustomEvent('submit', {
                    detail: input.value
                }));
            }
        })

        const searchButton = this.root.querySelector('.search-button');
        searchButton.addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('submit', {
                detail: input.value
            }));
        });
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'show') {
            this.root.querySelector('.wrapper').style.transform = 'translateX(250px)';
        }
    }

    static template() {
        return `
        ${CustomSearch.style()}

    <div class="wrapper">
      <div class="layout">
        <div class="box">
          <button class="search-button">
            <div class="search-button-wrapper">
              <span>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                  </path>
                </svg>
              </span>
            </div>
          </button>
          <div class="search-main">
            <div class="search-main-wrapper">
              <input type="text" maxlength="2048" name="q" aria-autocomplete="list" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" tabindex="0" title="搜索" aria-label="搜索" />
            </div>
          </div>
          <div class="right">
            <button class="close-button">
              <span>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                  </path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

   `;
    }

    static style() {
        return `
        <style>
.wrapper
{
    position: relative;
    overflow: visible;
    box-shadow: none;
    border-radius: 25px;
    background: none;
    margin: -1px 16px 0;
}
.layout
{
    background: none;
    border-radius: 25px;
    padding-bottom: 4px;
}
.box
{
    display: flex;
    height: 44px;
    margin-top: 0;
    z-index: 3;
    box-shadow: 0 2px 5px 0 rgba(60,64,67,.16);
    border-radius: 25px;
    background: #fff;
}
.search-button
{
    display: flex;
    border-radius: 0 25px 25px 0;
    background: transparent;
    border: none;
    margin: 0 -1px 0 0;
    padding: 0 0 0 12px;
    flex: 0 0 auto;
    outline: 0;
}
.search-button-wrapper
{
    background: none;
    color: #9aa0a6;
    height: 24px;
    width: 24px;
    margin: auto;
}
button span
{
    display: inline-block;
    fill: currentColor;
    height: 24px;
    line-height: 24px;
    position: relative;
    width: 24px;
}
.search-main
{
    flex: 1;
    display: flex;
    padding: 7px 0;
}
.search-main-wrapper
{
    display: flex;
    flex: 1;
}
input[type=text]
{
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
.right
{
    display: flex;
    flex: 0 0 auto;
    align-items: stretch;
    margin-right: -3px;
}
.close-button
{
    display: flex;
    flex: 1;
    color: #70757a;
    cursor: pointer;
    align-items: center;
    padding: 0 12px;
    margin: 0 0;
    border: 0;
    background: transparent;
    outline: 0;
}
        </style>`;
    }


}

customElements.define('custom-search', CustomSearch);
/*
<!--
<script src="search.js"></script>
<custom-search></custom-search>
const customCustomSearch = document.querySelector('custom-search');
-->
*/
class CustomHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomHeader.template();

        this.navItems = this.root.querySelector('.nav-items');
        this.insertItem("/index", "首页", "M12 3c0 0-6.186 5.34-9.643 8.232-0.203 0.184-0.357 0.452-0.357 0.768 0 0.553 0.447 1 1 1h2v7c0 0.553 0.447 1 1 1h3c0.553 0 1-0.448 1-1v-4h4v4c0 0.552 0.447 1 1 1h3c0.553 0 1-0.447 1-1v-7h2c0.553 0 1-0.447 1-1 0-0.316-0.154-0.584-0.383-0.768-3.433-2.892-9.617-8.232-9.617-8.232z");
        this.insertDivider();
        this.insertItem();
        this.insertItem("/admin.users", "会员", "M9 12.984q1.5 0 3.281 0.422t3.258 1.406 1.477 2.203v3h-16.031v-3q0-1.219 1.477-2.203t3.258-1.406 3.281-0.422zM15 12q-0.609 0-1.313-0.234 1.313-1.547 1.313-3.75 0-0.891-0.375-2.016t-0.938-1.781q0.703-0.234 1.313-0.234 1.641 0 2.813 1.195t1.172 2.836-1.172 2.813-2.813 1.172zM5.016 8.016q0-1.641 1.172-2.836t2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172-2.813-1.172-1.172-2.813zM16.688 13.125q2.484 0.375 4.406 1.383t1.922 2.508v3h-4.031v-3q0-2.297-2.297-3.891z");
        this.insertItem("/admin.notices", "公告", "M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z");
        this.insertDivider();
        this.insertItem("/admin.help", "帮助", "M15.047 11.25q0.938-0.938 0.938-2.25 0-1.641-1.172-2.813t-2.813-1.172-2.813 1.172-1.172 2.813h1.969q0-0.797 0.609-1.406t1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406l-1.219 1.266q-1.172 1.266-1.172 2.813v0.516h1.969q0-1.547 1.172-2.813zM12.984 18.984v-1.969h-1.969v1.969h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z");

    }


    static get observedAttributes() {
        return ['title'];
    }

    insertDivider() {
        const div = document.createElement('div');
        div.style.background = "#dadce0";
        div.style.height = "1px";
        div.style.margin = "5px 0";
        this.navItems.appendChild(div);
    }

    insertItem(href, title, d) {
        const navItem = document.createElement('a');
        navItem.setAttribute("class", "nav-item");
        navItem.setAttribute("href", href || "/admin.lessons");
        const img = document.createElement('div');
        img.setAttribute("class", "img");
        navItem.appendChild(img);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewbox", "0 0 24 24");
        img.appendChild(svg);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", d || "M12 8.016q-1.219 0-2.109-0.891t-0.891-2.109 0.891-2.109 2.109-0.891 2.109 0.891 0.891 2.109-0.891 2.109-2.109 0.891zM12 11.531q3.75-3.516 9-3.516v10.969q-5.203 0-9 3.563-3.797-3.563-9-3.563v-10.969q5.25 0 9 3.516z");
        svg.appendChild(path);
        navItem.appendChild(document.createTextNode(title || `课程`));
        this.navItems.appendChild(navItem);
    }

    connectedCallback() {
        const navItems = this.root.querySelector('.nav-items');
        const container = this.root.querySelector('.container');
        container.addEventListener('click', evt => {
            evt.stopPropagation();
            requestAnimationFrame(() => {
                navItems.style.transform = 'translateX(0)';
                setTimeout(() => {
                    container.style.display = 'none';
                    container.style.background = 'rgba(0,0,0,0)';
                }, 250)
            })
        });
        this.root.querySelector('.nav').addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('nav'));
            container.style.background = 'rgba(0,0,0,.6)';
            container.style.display = 'block';
            requestAnimationFrame(() => {
                navItems.style.transform = 'translateX(250px)';
            })
        })
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'title') {
            this.root.querySelector('.header').textContent = newVal;
        }
    }

    static template() {
        return `
        ${CustomHeader.style()}

    <div class="header">
    </div>
    <div class="nav">
      <div class="nav-wrapper">
        <svg style="fill: #70757a; width: 24px; height: 24px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none">
          </path>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z">
          </path>
        </svg>
      </div>
      <div class="container">
        <div class="nav-items">
          

        </div>
      </div>
    </div>
  
   `;
    }

    static style() {
        return `
        <style>
.header
{
    display: flex;
    height: 64px;
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.nav
{
    position: absolute;
    top: 0;
}
.nav-wrapper
{
    padding: 18px;
}
.container
{
    background-color: rgba(0,0,0,0);
    display: none;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 199;


}
.nav-items
{
    background-color: #fff;
    height: 100%;
    font-size: 16px;
    left: -250px;
    outline: none;
    overflow-y: scroll;
    padding-top: 15px;
    position: fixed;
    top: 0;
    transition: .5s;
    width: 250px;
    z-index: 200;
}
.nav-item
{
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    color: rgba(0,0,0,.54);
    height: 48px;
    line-height: 20px;
    width: 100%;
    vertical-align: middle;
    outline: 0;

}
.nav-item > .img
{
    padding: 0 15px;
    /*margin-bottom: 3px;*/
    width: 24px;
    /*vertical-align: middle;*/
  display: flex;
  align-items: center;
}
svg{
width: 24px;
height: 24px;
fill: currentColor;
}
        </style>`;
    }


}

customElements.define('custom-header', CustomHeader);
/*
<!--
<script src="index.js"></script>
<custom-index></custom-index>
-->
 */

let baseUri = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '';

async function loadData() {
    const response = await fetch(`${baseUri}/api/notice?mode=1`);
    return response.json();
}

async function render() {
    let obj;
    try {
        obj = await loadData();
        console.log(obj);
        const fragment = document.createDocumentFragment();
        obj.forEach(x => {
            const item = createNoticeItem(x);
            item.addEventListener('click', evt => {
                evt.stopPropagation();
                window.location = `./admin.notice?id=${x.id}`;
            });
            fragment.appendChild(item);
        });
        document.querySelector('.items').appendChild(fragment);
    } catch (e) {
        document.getElementById('toast').setAttribute('message', e.message);
    }
}

render();

function createNoticeItem(x) {
    const item = document.createElement('div');
    item.dataset.id = x.id;
    item.setAttribute("class", "item");
    const itemText = document.createElement('span');
    itemText.setAttribute("class", "item-text");
    item.appendChild(itemText);
    itemText.textContent = x.title;
    const itemSubtitle = document.createElement('div');
    itemSubtitle.setAttribute("class", "item-subtitle");
    item.appendChild(itemSubtitle);
    const t = new Date(x.updated_time * 1000);
    itemSubtitle.textContent = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${(t.getDate()).toString().padStart(2, '0')}`;
    return item;
}
