class CustomMenuPicker extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.layout
{
    margin: 0 24px;
    display: grid;
    gap: 1px;
    grid-template-columns: repeat(4,1fr);
    border: 1px solid #dadce0;
    border-radius: 8px;
    background: #dadce0;
    overflow: hidden;
}
.title
{
    padding: 0 24px 24px;
    font-size: 16px;
    line-height: 20px;
    font-weight: 500px;
    margin: 0;
}
.item
{
    padding: 8px;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    background: #fff;
}
.item[selected]
{
    background: #e8f0fe;
    color: #1967d2;
}</style>
    <section style="border-top: 1px solid #dadce0; padding: 20px 0 24px; color: #202124;">
      <h2 class="title">
      </h2>
      <div class="layout">
      </div>
    </section>`;
        this.layout = this.root.querySelector('.layout');

    }


    static get observedAttributes() {
        return ['data', 'title', 'columns', 'select'];
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
            JSON.parse(newVal)
                .forEach((element, index) => {
                    this.appendItem(element, index === 0);
                });;

        } else if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        } else if (attrName === 'columns') {
            this.layout.style.gridTemplateColumns = `repeat(${newVal},1fr)`
        } else if (attrName === 'select') {
            this.root.querySelectorAll('[selected]')
                .forEach(x => {
                    x.removeAttribute('selected')
                });
            this.selected = newVal;
            this.root.querySelectorAll('.item')
                .forEach(x => {
                    if (x.textContent === newVal)
                        x.setAttribute('selected', '');
                });
        }

    }

    appendItem(element, selected) {
        const div = document.createElement('div');
        div.className = 'item';
        div.textContent = element;

        div.addEventListener('click', evt => {
            this.root.querySelectorAll('[selected]')
                .forEach(x => {
                    x.removeAttribute('selected')
                })
            if (div.hasAttribute('selected'))
                div.removeAttribute('selected')
            else {
                div.setAttribute('selected', '');
                this.selected = element;
            }
        });
        this.layout.appendChild(div);
        if (selected) {
            div.setAttribute('selected', '');
            this.selected = element;
        }
    }

    get selectedItem() {
        return this.selected;
    }

}
customElements.define('custom-menu-picker', CustomMenuPicker);
/*
<!--\
<custom-menu-picker></custom-menu-picker>
<script src="custom-menu-picker.js"></script>
const customMenuPicker = document.querySelector('custom-menu-picker');
const customMenuPicker = document.createElement('custom-menu-picker');
customMenuPicker.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customMenuPicker);
-->
*/