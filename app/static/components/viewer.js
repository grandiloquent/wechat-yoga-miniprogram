class CustomViewer extends HTMLElement {
    constructor() {
        super();
        const div = document.createElement('div');
        div.setAttribute("style", "position:fixed;left:0;right:0;top:0;bottom:0;background:#000;overflow:hidden");
        document.body.appendChild(div);
        const img = document.createElement('img');
        img.setAttribute("style", "max-width:100%;position:absolute");
        div.appendChild(img);
        this.root = this.attachShadow({
            mode: 'open'
        });
        this.root.appendChild(div);
        this.img = img;

        div.insertAdjacentHTML('beforeend', `<div id="close" style="position: fixed;right: 12px;top: 12px;z-index: 1;height: 48px;width: 48px;border-radius: 50%;fill: currentColor;color: #fff;background: rgba(255,255,255,.15)">
<svg style="width:24px;height: 24px;position: absolute;margin-top: 12px;margin-left: 12px;" id="icon-clear" viewBox="0 0 24 24">
<path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
</svg>
</div>`)
        div.querySelector('#close').addEventListener('click', evt => {
            this.remove();
            document.body.style.overflow = 'auto';
        })
        document.body.style.overflow = 'hidden';
    }

    static get observedAttributes() {
        return ['src'];
    }

    connectedCallback() {
        /*
        When the user clicks on the image,
        enlarge the image to its original size,
        while maintaining the focus position of the image.

        In other words, the position of the part clicked by the mouse
        should remain the same after the image is enlarged.
         */
        // this.dispatchEvent(new CustomEvent());
        this.img.setAttribute('src', this.imgSrc)
        const height = window.innerHeight;
        const xt = ((height - this.img.getBoundingClientRect().height) / 2);
        this.img.style.top = xt + 'px';
        let first = true;
        let size = this.img.getBoundingClientRect();
        let top;
        let left;
        this.img.addEventListener('click', evt => {
            if (first) {
                const widthProportion = evt.offsetX / size.width;
                const heightProportion = evt.offsetY / size.height;
                this.img.removeAttribute('style');

                window.requestAnimationFrame(() => {
                    size = this.img.getBoundingClientRect();
                    const widthImage = size.width;
                    top = heightProportion * size.height - evt.clientY;
                    left = widthProportion * size.width - evt.clientX;
                    // left:-${(widthImage - window.innerWidth) * widthProportion}px;
                    // top:-${(this.img.getBoundingClientRect().height - window.innerHeight / 2) * heightProportion}px
                    this.img.style.transform= `translate(-${left}px,-${top}px)`;//`position:absolute;top:-${top}px;left:-${left}px`;
                })
                first = false;
            } else {
                /*
                size = this.img.getBoundingClientRect();
                const widthProportion = evt.offsetX / size.width;
                const heightProportion = evt.offsetY / size.height;
                // const widthProportion = evt.offsetX / size.width;
                // const heightProportion = evt.offsetY / size.height;
                // this.img.removeAttribute('style');
                // this.img.style.width = (size.width + size.width / 2) + 'px';
                // this.img.style.height= (size.height + size.height / 2) + 'px';
                // window.requestAnimationFrame(() => {
                //     size = this.img.getBoundingClientRect();
                //     const widthImage = size.width;
                //     const top = heightProportion * size.height - evt.clientY;
                //     const left = widthProportion * size.width - evt.clientX;
                //     // left:-${(widthImage - window.innerWidth) * widthProportion}px;
                //     // top:-${(this.img.getBoundingClientRect().height - window.innerHeight / 2) * heightProportion}px
                //     this.img.style = `position:absolute;top:-${top}px;left:-${left}px`;
                // })
                // transform-origin: ${evt.offsetX}px ${evt.offsetY}px
                // translate(${pos.x+left}px,${pos.y+top}px)
                let xt = heightProportion * size.height - evt.clientY;
                let xl = widthProportion * size.width - evt.clientX;
                this.img.style.left = -xl + 'px';
                this.img.style.top = -xt + 'px';
                this.img.style.transform = `scale(${1.5},${1.5})`;
            */

                console.log("\nevt.pageX", evt.pageX, "\nevt.pageY", evt.pageY, "\nevt.offsetX", evt.offsetX, "\nevt.offsetY", evt.offsetY, "\nthis.img.offsetTop", this.img.offsetTop, "\nthis.img.offsetLeft", this.img.offsetLeft);
                let w = size.width + size.width / 2;
                let h = size.height + size.height / 2

                const wr = (evt.offsetX) / w;
                //  - parseInt(this.img.style.top)
                const hr = (evt.offsetY-this.img.offsetTop) / h;
                //this.img.style.width = w + 'px';
                //this.img.style.height = h + 'px';
                this.img.style.transform=`scale(1.5,1.5) translate(${w*.3/2}px,${-parseInt(this.img.style.top)*.5}px)`;
                console.log(hr, h, evt.offsetY, this.img.offsetTop, "---------------------------")
                let x = wr * w - evt.pageX;
                let y = hr * h - evt.pageY;
                // parseInt(this.img.style.top)
               // this.img.style.top = (parseInt(this.img.style.top)*1.25 ) + 'px';
                //this.img.style.left = (parseInt(this.img.style.left)*1.25 ) + 'px';
                //(parseInt(this.img.style.left) + parseInt(this.img.style.left) / 2) + 'px'
                console.log("\nw", w, "\nh", h, "\nwr", wr, "\nhr", hr, "\nx", x, "\ny", y);

            }

        })
        this.img.addEventListener('click', evt => {

        });

    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'src') {
            this.imgSrc = newVal;
        }
    }
}

customElements.define('custom-viewer', CustomViewer);
/*
<!--
<script src="viewer.js"></script>
<custom-viewer></custom-viewer>
const customViewer = document.querySelector('custom-viewer');
customViewer.setAttribute('src', evt.currentTarget.src);
-->
*/