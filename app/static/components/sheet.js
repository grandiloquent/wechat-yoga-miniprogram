class CustomSheet extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.wrapper{
            background-color: #fff;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            box-shadow: 0 0 18px 0 rgba(5, 5, 5, 0.15);
            margin: 0 12px;
            border-radius: 10px;
            padding: 10px 0;
            position: inherit;
            justify-items: center
        }`;
        const container = document.createElement('div');
        container.className = 'wrapper';
        this.container = container;
        this.root.appendChild(container);


    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    makeItem(x) {
        const div = document.createElement('div');
        div.style.width = "70px";
        div.style.textAlign = "center";
        div.style.display = "inline-block";
        div.style.overflow = "hidden";
        const div1 = document.createElement('div');
        div1.style.width = "100%";
        div1.style.marginTop = "10px";
        div1.style.overflow = "hidden";
        div.appendChild(div1);
        const img = document.createElement('img');
        img.style.width = "50px";
        img.style.height = "50px";
        img.setAttribute("src", `https://static.lucidu.cn/images/${x.image.replaceAll(/^.+images\//g, '')}`);
        div1.appendChild(img);
        const div2 = document.createElement('div');
        div2.style.fontSize = "12px";
        div2.style.textAlign = "center";
        div1.appendChild(div2);
        div2.textContent = `${x.name}`;
        return div;
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
            obj.forEach((x, k) => {
                const v = this.makeItem(x);
                v.addEventListener('click', evt => {
                    if (k === 0) {
                        window.location = './encyclopedias';
                    } else if (k === 1) {
                        window.location = './appointment';
                    } else if (k === 4) {
                        window.location = './photos';
                    } else if (k === 5) {
                        window.location = './gift';
                    } else if (k === 6) {
                        window.location = './notices';
                    }  else if (k === 7) {
                        window.location = './help';
                    } 
                })
                this.container.appendChild(v)
            })
        }
    }

}
customElements.define('custom-sheet', CustomSheet);
/*
<!--\
<custom-sheet></custom-sheet>
<script src="components/sheet.js"></script>
const customSheet = document.querySelector('custom-sheet');
const customSheet = document.createElement('custom-sheet');
customSheet.setAttribute('',JSON.stringify(obj));
-->
*/