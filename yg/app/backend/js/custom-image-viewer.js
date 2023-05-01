class CustomImageViewer extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `<style>.overlay
{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    cursor: pointer;
    background-color: rgba(0,0,0,.8);
    display: flex;
}
img
{
    max-width: 100%;
    height: auto;
    flex-shrink: 0;
}</style>
    <div class="overlay">
      <img />
    </div>`;

        const overlay = this.root.querySelector('.overlay');
        overlay.addEventListener('click', evt => {
            this.remove();
        })


    }


    static get observedAttributes() {
        return ['src'];
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
        if (attrName === 'src') {
            const img = this.root.querySelector('img');
            img.src = newVal;
            img.addEventListener('load', evt => {
                const rw = img.naturalWidth / window.innerWidth;
                const rh = img.naturalHeight / window.innerHeight;
                const ratio = Math.max(rw, rh);
                img.style.width = `${ img.naturalWidth  / ratio}px`;
                img.style.height = `${img.naturalHeight / ratio}px`;
                img.style.marginTop = `${(window.innerHeight - img.naturalHeight / ratio) / 2}px`
                img.style.marginLeft = `${(window.innerWidth - img.naturalWidth / ratio) / 2}px`
            })
            img.textContent = this.getAttribute('src') || '';
        }
    }

}
customElements.define('custom-image-viewer', CustomImageViewer);
/*
<!--\
<custom-image-viewer></custom-image-viewer>
<script src="custom-image-viewer.js"></script>
const customImageViewer = document.querySelector('custom-image-viewer');
const customImageViewer = document.createElement('custom-image-viewer');
customImageViewer.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customImageViewer);
-->
*/