class CustomSelect extends HTMLElement {

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

  }


  static get observedAttributes() {
    return ['title'];
  }


  connectedCallback() {

    this.root.host.style.userSelect = 'none';
    this.root.innerHTML = `
    <style>.content-wrapper
    {
        -webkit-box-flex: 1;
        flex: 1;
        overflow-y: auto;
        padding-bottom: 12px;
    }
    .button
    {
        user-select: none;
        border: none;
        outline: none;
        font: inherit;
        text-transform: inherit;
        color: inherit;
        background: transparent;
        cursor: pointer;
        padding: 12px;
        margin: -12px 0;
        display: flex;
        algin-items: center;
    }
    .list-header-button
    {
        font-family: Roboto,Arial,sans-serif;
        word-wrap: break-word;
        -webkit-text-size-adjust: 100%;
        -webkit-box-direction: normal;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        user-select: none;
        font-size: 1.4rem;
        text-transform: uppercase;
        border-radius: 3px;
        position: relative;
        min-width: 0;
        margin: 0;
        flex-shrink: 0;
        color: #606060;
    }
    .list-header-title
    {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        max-height: 2.5em;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: .01em;
        -webkit-box-flex: 1;
        flex-grow: 1;
        margin: 0;
        font-weight: 700;
        font-size: 18px;
        line-height: 18px;
    }
    .list-header
    {
        font-family: Roboto,Arial,sans-serif;
        word-wrap: break-word;
        color: #030303;
        -webkit-text-size-adjust: 100%;
        font-size: 1.2rem;
        -webkit-box-direction: normal;
        display: flex;
        flex-shrink: 0;
        -webkit-box-align: center;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,.1);
        z-index: 3;
        position: sticky;
        top: 0;
        padding: 12px 12px;
    }
    .list-header-wrapper
    {
        font-family: Roboto,Arial,sans-serif;
        word-wrap: break-word;
        color: #030303;
        -webkit-text-size-adjust: 100%;
        font-size: 1.2rem;
        -webkit-box-direction: normal;
        z-index: 1;
        padding-top: 8px;
    }
    .panel-drag-line
    {
        background: #030303;
        opacity: .15;
        border-radius: 4px;
        height: 4px;
        margin: 0 auto;
        width: 40px;
    }
    .panel-container
    {
        background-color: #f9f9f9;
        -webkit-box-flex: 1;
        flex-grow: 1;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
        transform: translateY(0);
    }
    .list-background
    {
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        -webkit-box-flex: 1;
        flex-grow: 1;
        height: 100%;
        background: #000;
    }
    .list-renderer
    {
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }
    .panel
    {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: calc(56.25vw + 48px);
        z-index: 4;
    }
    .c3-overlay
    {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        cursor: pointer;
        background-color: rgba(0,0,0,.8);
    }</style>
        <div class="panel">
          <div class="list-renderer">
            <div class="list-background">
              <div class="panel-container">
                <div class="list-header-wrapper">
                  <div class="panel-drag-line">
                  </div>
                  <div class="list-header">
                    <div class="list-header-title">
                      说明
                    </div>
                    <div class="list-header-button">
                      <div class="button">
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M12.71,12l8.15,8.15l-0.71,0.71L12,12.71l-8.15,8.15l-0.71-0.71L11.29,12L3.15,3.85l0.71-0.71L12,11.29l8.15-8.15l0.71,0.71 L12.71,12z">
                          </path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content-wrapper">
                  <slot>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="c3-overlay">
        </div>
		`;
    // this.dispatchEvent(new CustomEvent());
    /*
    this.dispatchEvent(new CustomEvent('touch', {
              detail: 0
          }));
          */
    this.button = this.root.querySelector('.button');
    this.button.addEventListener('click', evt => {
      this.remove();
    })
    this.listHeaderTitle = this.root.querySelector('.list-header-title');

    this.c3Overlay = this.root.querySelector('.c3-overlay');
    this.c3Overlay.addEventListener('click', evt => {
      this.remove();
    })
    if (this.titleString) {
      this.listHeaderTitle.textContent = this.titleString;
    }
  }
  disconnectedCallback() {

  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'title') {
      if (this.listHeaderTitle)
        this.listHeaderTitle.textContent = newVal;
      else
        this.titleString = newVal;
    }
  }

}
customElements.define('custom-select', CustomSelect);
/*
<!--\
<custom-select></custom-select>
<script src="components/select.js"></script>
const customSelect = document.querySelector('custom-select');
const customSelect = document.createElement('custom-select');
customSelect.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customSelect);
-->
*/