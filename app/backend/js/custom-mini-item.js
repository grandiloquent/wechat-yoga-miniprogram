class CustomMiniItem extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.bottom-content
{
    align-items: flex-end;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
    max-width: 100%;
}
.layout
{
    display: flex;
    box-sizing: border-box;
    border-radius: 8px;
    background-color: #fff;
    border: 1px solid #dadce0;
    box-shadow: none;
    margin: 2px 0 8px;
    overflow: hidden;
    cursor: pointer;
    height: 140px;
    flex-direction: row;
    width: 100%;
}
.image
{
    background: no-repeat center/cover;
    flex: none;
    width: 138px;
}
.bottom
{
    align-items: flex-end;
    align-self: flex-end;
    display: flex;
    flex-direction: column;
    max-width: 100%;
}
.content
{
    display: flex;
    flex: 4 1 auto;
    flex-direction: column;
    justify-content: space-between;
    line-height: 20px;
    min-width: 0;
    width: 100%;
    padding: 16px 16px 8px;
}
.title
{
    font: 500 16px/20px Roboto,Arial,sans-serif;
    letter-spacing: .1px;
    color: #202124;
    padding: 0;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.subhead
{
    font: 500 14px/20px Roboto,Arial,sans-serif;
    letter-spacing: .25px;
    color: #202124;
    align-items: center;
    display: flex;
    margin-bottom: 4px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.bottom-title
{
    font: 500 14px/20px Roboto,Arial,sans-serif;
    letter-spacing: .25px;
    color: #202124;
    align-items: center;
    display: flex;
    max-width: 100%;
}
.bottom-subhead
{
    font: 400 12px/16px Roboto,Arial,sans-serif;
    letter-spacing: .3px;
    color: #70757a;
    align-items: center;
    display: flex;
    margin-bottom: 4px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}</style>
    <div class="layout">
      <div class="image">
      </div>
      <div class="content">
        <div class="title">
          其他
        </div>
        <div class="bottom">
          <div class="bottom-content">
            <div class="bottom-title">
            </div>
            <div class="bottom-subhead">
            </div>
          </div>
          <div class="subhead">
            其他
          </div>
        </div>
      </div>
    </div>`;

    }


    static get observedAttributes() {
        return ["image", "title", "bottom-title", "bottom-subhead", "subhead"];
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
        if (attrName === 'image') {
            this.root.querySelector('.image').style.backgroundImage = `url(${newVal})`;
        }
        else if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        }
        else if (attrName === 'bottom-title') {
            this.root.querySelector('.bottom-title').textContent = newVal;
        }
        else if (attrName === 'bottom-subhead') {
            this.root.querySelector('.bottom-subhead').textContent = newVal;
        }
        else if (attrName === 'subhead') {
            this.root.querySelector('.subhead').textContent = newVal;
        }
        /*
         "layout","image","content","title","bottom","bottom-content","bottom-title","bottom-subhead","subhead"
         const layout = this.root.querySelector('.layout');
 const image = this.root.querySelector('.image');
 const content = this.root.querySelector('.content');
 const title = this.root.querySelector('.title');
 const bottom = this.root.querySelector('.bottom');
 const bottomContent = this.root.querySelector('.bottom-content');
 const bottomTitle = this.root.querySelector('.bottom-title');
 const bottomSubhead = this.root.querySelector('.bottom-subhead');
 const subhead = this.root.querySelector('.subhead');else if (attrName === 'layout') {
             
         element.setAttribute("layout","");
 element.setAttribute("image","");
 element.setAttribute("content","");
 element.setAttribute("title","");
 element.setAttribute("bottom","");
 element.setAttribute("bottom-content","");
 element.setAttribute("bottom-title","");
 element.setAttribute("bottom-subhead","");
 element.setAttribute("subhead","");
         */

    }

}
customElements.define('custom-mini-item', CustomMiniItem);
/*
<!--\
<custom-mini-item></custom-mini-item>
<script src="custom-mini-item.js"></script>
const customMiniItem = document.querySelector('custom-mini-item');
const customMiniItem = document.createElement('custom-mini-item');
customMiniItem.setAttribute('title','');
document.body.appendChild(customMiniItem);
-->
*/