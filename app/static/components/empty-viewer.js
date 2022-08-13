class CustomEmptyViewer extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `<style>.button
        {
            -webkit-tap-highlight-color: transparent;
            -webkit-font-smoothing: antialiased;
            -webkit-box-direction: normal;
            font: inherit;
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            margin: 0;
            line-height: 1.2;
            text-align: center;
            cursor: pointer;
            transition: opacity .2s;
            -webkit-appearance: none;
            color: #fff;
            background-color: #ee0a24;
            border: 1px solid #ee0a24;
            padding: 0 15px;
            font-size: 14px;
            border-radius: 999px;
            width: 160px;
            height: 40px;
            display:flex;align-items: center;justify-content: center;
        }
        .empty__bottom
        {
            -webkit-tap-highlight-color: transparent;
            color: #323233;
            font-size: 16px;
            font-family: 'Open Sans',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC','miui','Hiragino Sans GB','Microsoft Yahei',sans-serif;
            -webkit-font-smoothing: antialiased;
            -webkit-box-direction: normal;
            margin-top: 24px;
            
        }
        .wrapper
        {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 0;
            flex-direction: column;
        }
        img
        {
            width: 160px;
            height: 160px;
        }
        .text
        {
            margin-top: 16px;
            color: #969799;
            font-size: 14px;
            line-height: 20px;
            padding: 0 60px;
        }</style>
            <div class="wrapper">
              <img />
              <div class="text">
                没有找到预约的课程
              </div>
              <div class="empty__bottom">
                <div class="button">
                </div>
              </div>
            </div>
		`;
    }

    get src() {
        return this.getAttribute('src');
    }
    get text() {
        return this.getAttribute('text');
    }
    get label() {
        return this.getAttribute('label');
    }
    static get observedAttributes() {
        return ['src', 'text', 'label'];
    }


    connectedCallback() {


        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
        this.img = this.root.querySelector('img');
        this.textRender = this.root.querySelector('.text');
        this.img.setAttribute('src', this.src || 'http://static.lucidu.cn/images/empty-image-default.png');
        this.textRender.textContent = this.text;
        this.button = this.root.querySelector('.button');

        if (this.label) {
            this.button.textContent = this.label;
            this.button.addEventListener('click', evt => {
                this.dispatchEvent(new CustomEvent('submit'));
            })
        } else {
            this.button.style.display = 'none';
        }


    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'src') {
            if (this.img)
                this.img.setAttribute('src', newVal);
        } else if (attrName === 'text') {
            if (this.img)
                this.img.textContent = newVal;
        }
    }

}
customElements.define('custom-empty-viewer', CustomEmptyViewer);
/*
<!--\
<custom-empty-viewer></custom-empty-viewer>
<script src="components/empty-viewer.js"></script>
const customEmptyViewer = document.querySelector('custom-empty-viewer');
const customEmptyViewer = document.createElement('custom-empty-viewer');
customEmptyViewer.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customEmptyViewer);
-->
*/