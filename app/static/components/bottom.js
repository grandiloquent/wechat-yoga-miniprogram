class CustomBottom extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'open'
        });

        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        document.body.appendChild(wrapper);
        const item = document.createElement('div');
        item.setAttribute("class", "item");
        wrapper.appendChild(item);
        const a = document.createElement('a');
        a.setAttribute("href", "./index");
        a.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");
        item.appendChild(a);
        const img = document.createElement('div');
        img.setAttribute("class", "img");
        item.appendChild(img);
        const img1 = document.createElement('img');
        img1.setAttribute("src", "https://static.lucidu.cn/images/home-off.png");
        img.appendChild(img1);
        const text = document.createElement('div');
        text.setAttribute("class", "text");
        item.appendChild(text);
        text.textContent = "首页";
        const item2 = document.createElement('div');
        item2.setAttribute("class", "item");
        wrapper.appendChild(item2);
        const a3 = document.createElement('a');
        a3.setAttribute("href", "./appointment");
        a3.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");
        item2.appendChild(a3);
        const img4 = document.createElement('div');
        img4.setAttribute("class", "img");
        item2.appendChild(img4);
        const img5 = document.createElement('img');
        img5.setAttribute("src", "https://static.lucidu.cn/images/yueke.png");
        img4.appendChild(img5);
        const text6 = document.createElement('div');
        text6.setAttribute("class", "text");
        item2.appendChild(text6);
        text6.textContent = "约课";
        const item7 = document.createElement('div');
        item7.setAttribute("class", "item");
        wrapper.appendChild(item7);
        const a2 = document.createElement('a');
        a2.setAttribute("href", "./booked");
        a2.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");

        item7.appendChild(a2)

        const img8 = document.createElement('div');
        img8.setAttribute("class", "img");
        item7.appendChild(img8);
        const img9 = document.createElement('img');
        img9.setAttribute("src", "https://static.lucidu.cn/images/check-in.png");
        img8.appendChild(img9);
        const text10 = document.createElement('div');
        text10.setAttribute("class", "text");
        item7.appendChild(text10);
        text10.textContent = "已约";
        const item11 = document.createElement('div');
        item11.setAttribute("class", "item");
        wrapper.appendChild(item11);
        const a5 = document.createElement('a');
        a5.setAttribute("href", "./user");
        a5.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");

        item11.appendChild(a5)

        const img12 = document.createElement('div');
        img12.setAttribute("class", "img");
        item11.appendChild(img12);
        const img13 = document.createElement('img');
        img13.setAttribute("src", "https://static.lucidu.cn/images/my-off.png");
        img12.appendChild(img13);
        const text14 = document.createElement('div');
        text14.setAttribute("class", "text");
        item11.appendChild(text14);
        text14.textContent = "我的";

        wrapper.insertAdjacentHTML('afterbegin', CustomBottom.style());
        this.root.appendChild(wrapper);

        this.item = item;
        this.item1 = item2;
        this.item2 = item7;
        this.item3 = item11;

    }


    static get observedAttributes() {
        return ['selected'];
    }

    connectedCallback() {
        if (this.selected === '1') {
            this.item.className = 'item active';
            this.item.querySelector('img').src = 'https://static.lucidu.cn/images/home-on.png'
        } else if (this.selected === '2') {
            this.item1.className = 'item active';
            this.item1.querySelector('img').src = 'https://static.lucidu.cn/images/yueke-on.png'
        } else if (this.selected === '3') {
            this.item2.className = 'item active';
            this.item2.querySelector('img').src = 'https://static.lucidu.cn/images/check-in-on.png'
        } else if (this.selected === '4') {
            this.item3.className = 'item active';
            this.item3.querySelector('img').src = 'https://static.lucidu.cn/images/my-on.png'
        }
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'selected') {
            this.selected = newVal;
        }
    }

    static style() {
        return `
        <style>
.wrapper
{
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    z-index: 3;
    height: 48px;
    border-top: 1px solid rgba(0,0,0,.1);
    background: rgba(255,255,255,.98);
    color: #030303;
    font-size: 12px;
}
.text
{
    max-width: 100%;
    padding: 0 4px;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #030303;
}
.active .text
{
    color: #749b15;
}
.img
{
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke: none;
    color: #030303;
    display: block;
}
.img>img{
width: 100%;
}
.item
{
    display: flex;
    -webkit-box-flex: 1;
    flex: 1 1 0%;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}
        </style>`;
    }
}

customElements.define('custom-bottom', CustomBottom);
/*
<!--
<script src="bottom.js"></script>
<custom-bottom></custom-bottom>
const customCustomBottom = document.querySelector('custom-bottom');
-->
*/