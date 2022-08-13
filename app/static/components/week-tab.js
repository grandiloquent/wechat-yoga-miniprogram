class CustomWeekTab extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.active{
        color:#1a73e8;
        }`


        const div = document.createElement('div');

        div.style.justifyItems = "center";
        div.style.display = "grid";
        div.style.gridTemplateColumns = "repeat(7, 1fr)";
        div.style.fontSize = "12px";
        div.style.padding = "8px 12px 16px";
        div.style.background = "#fff";
        div.style.position = 'relative';

        this.root.appendChild(div);
        this.items = [];
        '一二三四五六日'.split('')
            .forEach(x => {
                const d = document.createElement('div');
                d.textContent = `周${x}`;
                div.appendChild(d);
                this.items.push(d);
            });
        const border = document.createElement('div');
        border.style.height = '3px';
        border.style.backgroundColor = '#1a73e';
        border.style.willChange = 'left,width';
        border.style.position = 'absolute';
        border.style.bottom = '10px';
        border.style.borderTopLeftRadius = "3px";
        border.style.borderTopRightRadius = "3px";
        border.style.backgroundColor = '#1a73e8';
        div.appendChild(border);
        this.border = border;
    }


    static get observedAttributes() {
        return ['select'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        this.items[0].className = 'active';
        this.scroll(this.items[0]);
        this.items.forEach((x, k) => {
            x.addEventListener('click', evt => {
                this.root.querySelector('.active').className = '';
                this.scroll(this.items[k]);
                this.dispatchEvent(new CustomEvent('touch', {
                    detail: k
                }))
            })
        })
    }

    scroll(element) {
        const r = element.getBoundingClientRect()
        this.border.style.width = r.width + 'px';
        this.border.style.left = r.x + 'px';
        element.className = 'active';
        this.border.style.transition = "left 0.15s cubic-bezier(0.4,0,1,1),width 0.15s cubic-bezier(0.4,0,1,1)";

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'select') {
            this.root.querySelector('.active').className = '';
            this.scroll(this.items[parseInt(newVal)])
        }
    }

}

customElements.define('custom-week-tab', CustomWeekTab);
/*
<!--\
<custom-week-tab></custom-week-tab>
<script src="components/week-tab.js"></script>
const customWeekTab = document.querySelector('custom-week-tab');
const customWeekTab = document.createElement('custom-week-tab');
customWeekTab.setAttribute('',JSON.stringify(obj));
-->
*/