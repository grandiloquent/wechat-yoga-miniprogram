(function () {
    class CustomUploader extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({ mode: 'open' });
            this.container = document.createElement('div');
            this.root.appendChild(this.container);
            this.container.innerHTML = CustomUploader.template();
        }

        static get observedAttributes() {
            return ['uri', 'host', 'max', 'images', 'title'];
        }

        connectedCallback() {
            // this.dispatchEvent(new CustomEvent());
            const button = this.root.querySelector('#button');
            const items = this.root.querySelector('#items');
            items.addEventListener('click', evt => {
                evt.stopPropagation();
            });
            this.items = items;
            this.button = button;

            button.addEventListener('click', evt => {
                evt.stopPropagation();
                this.uploadImage();
            });
            this.root.querySelector('#images .button').addEventListener('click', evt => {
                evt.stopPropagation();
                this.uploadImage();
            });
        }

        disconnectedCallback() {
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            if (attrName === 'uri') {
                this.uri = newVal;
            } else if (attrName === 'host') {
                this.host = newVal;
            } else if (attrName === 'max') {
                this.max = newVal;
            } else if (attrName === 'images') {
                this.button.parentNode.style.display = 'none';
                this.items.style.display = 'block';
                JSON.parse(newVal).forEach(x => this.appendImagePreview(x))
            } else if (attrName === 'title') {
                this.root.querySelector('#title').textContent = newVal;
            }
        }

        static template() {
            return `
        ${CustomUploader.style()}

    <div id="title" style="color: #202124; font-size: 16px; font-weight: 500; line-height: 24px; padding-bottom: 2px;">
      课程照片
    </div>
    <div style="color: #70757a; font-size: 16px; font-weight: 400; line-height: 24px;">
      <slot name="subtitle">
      </slot>
    </div>
    <div style="color: rgba(0,0,0,.87); margin-bottom: 12px; margin-top: 12px;">
      <div id="button" style="align-items: center; background: transparent; border-radius: 9999px; border: 1px solid #dadce0; box-shadow: none; box-sizing: border-box; color: #3c4043; display: inline-flex; font-size: 14px; height: 36px; justify-content: center; margin-bottom: 6px; margin-top: 6px; min-width: 64px; padding: 0 16px 0 12px;">
        <div style="color: #1a73e8; height: 18px; margin-right: 8px; width: 18px; fill: currentColor;">
          <svg style="width: 100%; height: 100%;" viewBox="0 0 24 24" focusable="false" class="NMm5M">
            <path d="M20 10h-2V7h-3V5h3V2h2v3h3v2h-3v3zm-4 3c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm4-1v7H4V7h9V3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-7h-2z">
            </path>
          </svg>
        </div><span>添加照片
        </span>
      </div>
    </div>
    <!--display: none-->
    <div id="items" style="height: 96px; width: 100%; margin: 12px 0;display: none">
<!--      <div style="height: 100%; overflow-y: hidden; overflow-x: auto; white-space: nowrap;">-->
        <div id="images" style="display: flex;flex-wrap: wrap;gap: 8px;">
          <div class="button" style="padding: 0 23px 0 23px; border: 1px solid #dadce0; border-radius: 16px; margin:0 0 8px 0; width: 112px; height: 96px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #1a73e8; background: rgba(26,115,232,.04);">
            <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
              <path d="M9.797 14.016q0-1.359 0.938-2.297t2.25-0.938q1.359 0 2.297 0.938t0.938 2.297q0 1.313-0.938 2.25t-2.297 0.938-2.273-0.914-0.914-2.273zM12.984 18.984q2.063 0 3.539-1.453t1.477-3.516-1.477-3.539-3.539-1.477-3.516 1.477-1.453 3.539 1.453 3.516 3.516 1.453zM6 9.984v-3h3v-3h6.984l1.828 2.016h3.188q0.797 0 1.406 0.609t0.609 1.406v12q0 0.797-0.609 1.383t-1.406 0.586h-15.984q-0.797 0-1.406-0.586t-0.609-1.383v-10.031h3zM3 3.984v-3h2.016v3h3v2.016h-3v3h-2.016v-3h-3v-2.016h3z">
              </path>
            </svg>
          </div>
          
          
          
        </div>
<!--      </div>-->
    </div>
  
   `;
        }

        static style() {
            return `
        <style>
        </style>`;
        }

        createInput() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = false;
            input.accept = 'image/*';
            input.style.position = 'fixed';
            input.style.left = '-100%';
            document.body.appendChild(input);
            return input;
        }

        appendImagePreview(src) {
            if (!src.startsWith('https://')) {
                src = `${this.host}/${src}`
            }
            const template = `<div style="position: relative; overflow: hidden; border: 1px solid #dadce0; border-radius: 16px; margin:0 0 8px 0; width: 112px; height: 96px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #1a73e8; background: rgba(26,115,232,.04);">
            <div id="close" style="position: absolute; right: 8px; top: 8px; height: 32px; width: 32px; background: rgba(32,33,36,.6); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 24px; height: 24px; fill: #fff;" viewBox="0 0 24 24">
                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z">
                </path>
              </svg>
            </div>
            <img style="max-width: 100%; object-fit: contain;" src="${src}" />
          </div>`;
            const div = document.createElement('div');
            div.className = 'image'
            div.innerHTML = template;
            div.dataset.src = src;
            div.querySelector('#close').addEventListener('click', evt => {
                div.remove();
                this.dispatchEvent(new CustomEvent('remove', {
                    detail: src
                }));
            });
            if (parseInt(this.max) === 1) {
                this.root.querySelectorAll('.image')
                    .forEach(x => x.remove())
            }
            this.items.querySelector('#images').appendChild(div);
        }

        uploadImage() {
            const input = this.createInput();
            input.addEventListener('change', async evt => {
                const formData = createUploadData(input)
                const text = await uploadData(this.uri, formData);
                this.button.parentNode.style.display = 'none';
                this.items.style.display = 'block';
                this.appendImagePreview(text);
                this.dispatchEvent(new CustomEvent('upload', {
                    detail: [...this.root.querySelectorAll('.image')]
                        .map(x => x.dataset.src)
                }));
            })
            input.click();
        }
    }

    async function uploadData(uri, formData) {
        const res = await fetch(uri, {
            method: 'POST',
            body: formData
        });
        return await res.text();
    }

    function createUploadData(input) {
        const formData = new FormData();
        formData.append("images", input.files[0], input.files[0].name)
        return formData;
    }

    customElements.define('custom-uploader', CustomUploader);
    /*
    <!--
    <script src="uploader.js"></script>
    <custom-uploader></custom-uploader>
    const customCustomUploader = document.querySelector('custom-uploader');
    -->
    */
})()
class CustomAction extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomAction.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
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
        ${CustomAction.style()}
    <div style="border-top: solid 1px #dadce0; padding: 0 16px; height: 48px; align-items: center; color: #202124; display: flex; font-size: 14px; line-height: 20px;">
      <div style="flex-shrink: 0;width: 24px; height: 24px; margin-right: 24px; color: #1a73e8; fill: currentColor;">
        <slot name="svg">
        </slot>
      </div>
      <slot name="text">
      </slot>
    </div>
   `;
    }

    static style() {
        return `
        <style>
       
        </style>`;
    }


}

customElements.define('custom-action', CustomAction);
/*
<!--
<script src="action.js"></script>
<custom-action></custom-action>
const customCustomAction = document.querySelector('custom-action');
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

class CustomInput extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomInput.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());

        // const textarea = this.root.querySelector('textarea');
        // textarea.focus();
        // textarea.addEventListener('click', evt => {
        //     evt.stopPropagation();
        // });

        this.close = this.root.querySelector('#close');
        this.close.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
        });

        this.closeButton = this.root.querySelector('#close-button');
        this.closeButton.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
        });

        this.ok = this.root.querySelector('#ok');
        this.ok.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
            this.dispatchEvent(new CustomEvent('submit',
            //     {
            //     detail: textarea.value
            // }
            ));
        });


    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'text') {
            this.root.querySelector('textarea').value = newVal;
        }
    }

    static template() {
        return `
        ${CustomInput.style()}

    <div style="position: fixed; left: 0; top: 0; right: 0; bottom: 0; display: flex; background: #fff; flex-direction: column;">
      <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <div style="height: 48px; border-bottom: 1px solid #dadce0; width: 100%; display: flex;">
          <div style="flex-grow: 1;">
          </div>
          <div id="close-button" style="width: 48px; height: 48px;">
            <svg style="width: 24px; height: 24px; margin-top: 12px; margin-left: 12px;" viewBox="0 0 24 24">
              <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z">
              </path>
            </svg>
          </div>
        </div>
        <div style="flex-grow: 1;width: 100%">
          <slot>
          </slot>
        </div>
      </div>
      <div class="buttons">
        <div id="close" class="button" style="border-right: 1px solid #dadce0;">
          取消
        </div>
        <div id="ok" class="button">
          确定
        </div>
      </div>
    </div>
  
   `;
    }

    static style() {
        return `
        <style>
             .buttons{
border-top: 1px solid #dadce0; width: 100%; height: 56px; flex-shrink: 0; display: flex; align-items: center;
}
.button
{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    background-color: #fff;
    color: #1a73e8;
    height: 100%;
    width: 50%;
}

        </style>`;
    }


}

customElements.define('custom-input', CustomInput);
/*
<!--
<script src="input.js"></script>
<custom-input></custom-input>
const customCustomInput = document.querySelector('custom-input');
-->


*/
let baseUri = '';
const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
	evt.stopPropagation();
	console.log(evt.detail)
	try {
		await submitPicture({
			url: evt.detail[evt.detail.length-1]
		})
	} catch (e) {
		console.log(e);
	}
});
customUploader.addEventListener('remove', async evt => {
	evt.stopPropagation();
	try {
		await deletePicture(evt.detail);
	} catch (e) {
		console.log(e);
	}
});
async function deletePicture(src) {
	const res = await fetch(`${baseUri}/api/picture?url=${src}`, {
		method: 'DELETE'
	});
	return res.text();
}
async function submitPicture(obj) {
	const response = await fetch(`${baseUri}/api/picture`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(obj)
	});
	return response.text();
}
async function fetchPictures() {
	const response = await fetch(`${baseUri}/api/picture?mode=1&limit=100`);
	return response.json();
}
async function loadData() {
	try {
		const obj = await fetchPictures();
		console.log(obj);
      customUploader.setAttribute('images',JSON.stringify(obj.map(x=>x.url)));
	} catch (e) {
		console.log(e);
	}
}
loadData();
