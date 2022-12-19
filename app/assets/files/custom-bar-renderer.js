class CustomBarRenderer extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});

        this.root.innerHTML = `<style>.text
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
.image
{
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke: none;
    color: #030303;
    display: block;
}
.item
{
    display: flex;
    -webkit-box-flex: 1;
    flex: 1 1 0%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    overflow: hidden;
    color: #030303;
}</style>
    <div style="display: flex; justify-content: space-around; position: fixed; bottom: 0; left: 0; right: 0; padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); z-index: 3; height: 48px; border-top: 1px solid rgba(0,0,0,.1); background: rgba(255,255,255,.98); color: #030303; font-size: 1.1rem;">
      <div style="display: flex; -webkit-box-flex: 1; flex: 1 1 0%; min-width: 0;">
        <div class="item" id="home">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
              <g>
                <path d="M4,21V10.08l8-6.96l8,6.96V21h-6v-6h-4v6H4z">
                </path>
              </g>
            </svg>
          </div>
          <div class="text">
            首页
          </div>
        </div>
        <div class="item" id="fav">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div class="text">
            收藏
          </div>
        </div>
        <div class="item" id="action-sort">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" />
            </svg>
          </div>
          <div class="text">
            排序
          </div>
        </div>
        <div class="item" id="action-menu">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M3 6h18v2.016h-18v-2.016zM3 12.984v-1.969h18v1.969h-18zM3 18v-2.016h18v2.016h-18z">
              </path>
            </svg>
          </div>
          <div class="text">
            菜单
          </div>
        </div>
      </div>
    </div>`;
        this.root.querySelector('#fav').addEventListener('click', evt => {
            const customFavorites = document.createElement('custom-favorites');
            document.body.appendChild(customFavorites);
        })
        const home = this.root.querySelector('#home');
        home.addEventListener('click', evt => {
            window.location = "/"
        })
        this.root.getElementById('action-sort')
            .addEventListener('click', evt => {
                evt.stopPropagation();
                this.dispatchEvent(new CustomEvent('submit-sort'));
            });

        this.root.getElementById('action-menu')
            .addEventListener('click', evt => {
                evt.stopPropagation();
                this.dispatchEvent(new CustomEvent('submit-menu'));
            });
    }


    static get observedAttributes() {
        return ['data'];
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
            const obj = JSON.parse(newVal);
        }
    }

}

customElements.define('custom-bar-renderer', CustomBarRenderer);
/*
<!--\
<custom-bar-renderer></custom-bar-renderer>
<script src="custom-bar-renderer.js"></script>
const customBarRenderer = document.querySelector('custom-bar-renderer');
const customBarRenderer = document.createElement('custom-bar-renderer');
customBarRenderer.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customBarRenderer);
-->
*/