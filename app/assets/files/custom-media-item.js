class CustomMediaItem extends HTMLElement {

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    this.root.innerHTML = `<style>#thumbnail-img
{
    min-width: 1px;
    filter: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    min-height: 100%;
    margin: auto;
}
#media-item-image
{
    color: currentColor;
    text-decoration: none;
    flex-shrink: 0;
    display: block;
}
#media-item-menu
{
    outline: none;
    font: inherit;
    position: relative;
    margin: 0;
    white-space: nowrap;
    min-width: 0;
    text-transform: none;
    font-weight: 500;
    border: none;
    cursor: pointer;
    outline-width: 0;
    box-sizing: border-box;
    background: none;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    flex-direction: row;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    -webkit-box-flex: 0;
    flex: none;
    height: 48px;
    font-size: 18px;
    line-height: 48px;
    border-radius: 24px;
    width: 48px;
    padding: 0;
    color: #030303;
}
#media-item-metadata-content
{
    color: currentColor;
    text-decoration: none;
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    padding: 0 8px;
    display: flex;
    flex-direction: column;
}
#media-item-headline
{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-height: 1.25;
    text-overflow: ellipsis;
    font-weight: normal;
    overflow: hidden;
    margin: 0;
    font-size: 1.4rem;
    max-height: 3.75em;
    -webkit-line-clamp: 3;
}
#subhead
{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    max-height: 2.5em;
    -webkit-line-clamp: 2;
    overflow: hidden;
    line-height: 1.25;
    text-overflow: ellipsis;
    font-weight: normal;
    opacity: .6;
}
#icon-check_box
{
    fill: rgba(0,0,0,.25);
}</style>
    <div style="padding: 12px 12px 0; display: flex;">
      <a id="media-item-image">
        <div style="display: flex; -webkit-box-align: center; align-items: center; -webkit-box-pack: center; justify-content: center; position: relative; flex-shrink: 0; overflow: hidden; width: 90px; height: 90px;">
          <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 100%; min-height: 100%; margin: auto; background-color: rgba(0,0,0,.1);">
          </div><img id="thumbnail-img" />
          <div style="position: absolute; bottom: 0; left: 0; right: 0; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; flex-direction: column; -webkit-box-align: end; align-items: flex-end;">
          </div>
        </div>
      </a>
      <div style="display: flex; -webkit-box-flex: 1; flex-grow: 1; min-width: 0; overflow: visible;">
        <a id="media-item-metadata-content">
          <div id="media-item-headline">
          </div>
          <div id="subhead">
            <div id="media-item-byline">
            </div>
          </div>
          <div style="flex-grow: 1;">
          </div>
          <div style="display: flex;">
            <div id="icon-check_box" style="width: 24px; height: 24px;">
              <svg viewBox="0 0 24 24">
                <path d="M18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h13.969zM18.984 5.016h-13.969v13.969h13.969v-13.969z">
                </path>
              </svg>
            </div>
          </div>
        </a>
        <div style="flex-shrink: 0; color: #909090;">
          <button id="media-item-menu">
            <div style="line-height: 0; fill: currentColor; width: 24px; height: 24px;">
              <div style="display: inline-block; flex-shrink: 0; width: 24px; height: 24px; fill: currentColor; stroke: none;">
                <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z">
                  </path>
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>`;

    const thumbnailImg = this.root.querySelector('#thumbnail-img');
    thumbnailImg.src = this.getAttribute('src') || '';
    const mediaItemImage = this.root.querySelector('#media-item-image');
    mediaItemImage.href = this.getAttribute('href') || '';
    const mediaItemMenu = this.root.querySelector('#media-item-menu');
    mediaItemMenu.addEventListener('click', evt => {
      this.dispatchEvent(new CustomEvent('submit'));
    });
    mediaItemImage.addEventListener('click', evt => {
      evt.preventDefault();
      const customImageViewer = document.createElement('custom-image-viewer');

      customImageViewer.setAttribute('src', thumbnailImg.src);
      document.body.appendChild(customImageViewer);
    });
    const iconCheckBox = this.root.querySelector('#icon-check_box');
    iconCheckBox.addEventListener('click', evt => {
      evt.stopPropagation();
      evt.preventDefault();
      if (this.root.className === "selected") {
        this.root.className = "";
        iconCheckBox.querySelector('path').setAttribute('d', 'M18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h13.969zM18.984 5.016h-13.969v13.969h13.969v-13.969z');
        this.root.host.removeAttribute('data-active');
        localStorage.setItem('files', JSON.stringify(
          JSON.parse(
            localStorage.getItem('files')
          ).filter(x => x !== this.root.host.dataset.path)
        ));
      }
      else {
        this.root.className = "selected";
        iconCheckBox.querySelector('path').setAttribute('d', 'M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563-1.406 1.406zM18.984 3q0.844 0 1.43 0.586t0.586 1.43v13.969q0 0.844-0.586 1.43t-1.43 0.586h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.844 0.586-1.43t1.43-0.586h13.969z');
        this.root.host.setAttribute('data-active', '')
        let obj = JSON.parse(
          localStorage.getItem('files')
        ) || [];
        obj.push(this.root.host.dataset.path);
        obj = [...new Set(obj)];
        localStorage.setItem('files', JSON.stringify(obj
        ));
      }
    })

  }


  static get observedAttributes() {
    return ['src', "title", "href", "subhead", "checked"];
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
      this.root.querySelector('#thumbnail-img').src = newVal;
    } else if (attrName === "title") {
      this.root.querySelector('#media-item-headline').textContent = newVal;
    } else if (attrName === "href") {
      this.root.querySelector('#media-item-metadata-content').href = newVal;
    } else if (attrName === "subhead") {
      this.root.querySelector('#media-item-byline').textContent = newVal;
    } else if (attrName === "checked") {
      if (newVal === 'true') {
        this.root.querySelector('#icon-check_box').querySelector('path').setAttribute('d', 'M9.984 17.016l9-9-1.406-1.453-7.594 7.594-3.563-3.563-1.406 1.406zM18.984 3q0.844 0 1.43 0.586t0.586 1.43v13.969q0 0.844-0.586 1.43t-1.43 0.586h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.844 0.586-1.43t1.43-0.586h13.969z');
        this.root.host.setAttribute('data-active', '')
        let obj = JSON.parse(
          localStorage.getItem('files')
        ) || [];
        obj.push(this.root.host.dataset.path);
        obj = [...new Set(obj)];
        localStorage.setItem('files', JSON.stringify(obj
        ));
      } else {
        this.root.querySelector('#icon-check_box').querySelector('path').setAttribute('d', 'M18.984 3q0.797 0 1.406 0.609t0.609 1.406v13.969q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.797 0-1.406-0.609t-0.609-1.406v-13.969q0-0.797 0.609-1.406t1.406-0.609h13.969zM18.984 5.016h-13.969v13.969h13.969v-13.969z');
        this.root.host.removeAttribute('data-active')
        localStorage.setItem('files', JSON.stringify(
          JSON.parse(
            localStorage.getItem('files')
          ).filter(x => x !== this.root.host.dataset.path)
        ));
      }
    }

  }

  

}
customElements.define('custom-media-item', CustomMediaItem);
/*
<!--\
<custom-media-item></custom-media-item>
<script src="components/custom-media-item.js"></script>
const customMediaItem = document.querySelector('custom-media-item');
const customMediaItem = document.createElement('custom-media-item');
customMediaItem.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customMediaItem);
-->
*/