class CustomFilter extends HTMLElement {

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

    this.root.innerHTML = `<style>.button
{
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border: none;
    outline: none;
    line-height: inherit;
    -webkit-user-select: none;
    -webkit-appearance: none;
    overflow: visible;
    vertical-align: middle;
    background: transparent;
    -webkit-font-smoothing: antialiased;
    text-decoration: none;
    border-style: solid;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    border-width: 1px;
    font-size: .875rem;
    letter-spacing: .0107142857em;
    font-weight: 500;
    text-transform: none;
    transition: border 280ms cubic-bezier(.4,0,.2,1),box-shadow 280ms cubic-bezier(.4,0,.2,1);
    box-shadow: none;
    will-change: unset;
    height: 32px;
    border-radius: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    min-width: 32px;
    background-color: #fff;
    color: #3c4043;
    border-color: #dadce0;
    padding: 0 6px 0 6px;
}
.item
{
    margin-right: 8px;
    align-items: center;
    display: inline-flex;
    height: 32px;
    margin-bottom: 8px;
    margin-top: 8px;
    overflow: visible;
    flex: 0 0 auto;
}
.item:first-child
{
    margin-left: 16px;
}
.layout
{
    border-radius: 0 0 16px 16px;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,.3),0 2px 6px 2px rgba(60,64,67,.15);
    background-color: #fff;
    border-bottom: 1px solid #dadce0;
    padding: 0 16px 0 16px;/*8px*/
}
.wrapper
{
    display: flex;
    flex-direction: row;
    margin: 0 -16px;
    overflow-x: scroll;/*padding-top: 8px;*/
}
::-webkit-scrollbar
{
    display: none;
}
.selected>button
{
    background-color: #e8f0fe;
    color: #1967d2;
}</style>
    <div class="layout">
      <div class="wrapper">
        <div style="align-items: center; display: flex; overflow-y: hidden; overflow-x: auto;">
          <div class="item">
            <button class="button">
              <svg style="fill: #1967d2;" width="18" height="18" viewBox="0 0 24 24" focusable="false">
                <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z">
                </path>
              </svg>
            </button>
          </div>
          <div class="item selected">
            <button class="button" style="padding: 0 11px;">
              今天
            </button>
          </div>
          <div class="item">
            <button class="button" style="padding: 0 11px;">
              明天
            </button>
          </div>
          <div class="item">
            <button class="button" style="padding: 0 11px;">
              后天
            </button>
          </div>
          <div class="item">
            <button class="button" style="padding: 0 11px;">
              大后天
            </button>
          </div>
          <div class="item">
            <button class="button" style="padding: 0 11px;">
              昨天
            </button>
          </div>
        </div>
      </div>
    </div>`;
    [...this.root.querySelectorAll('.item')]
      .forEach((x, key) => {
        x.addEventListener('click', evt => {
          if (!evt.currentTarget.classList.contains('selected')) {
            [...this.root.querySelectorAll('.selected')]
              .forEach(x => x.classList.remove('selected'))
            evt.currentTarget.classList.add('selected');
            this.dispatchEvent(new CustomEvent('submit', {
              detail: key
            }))
          }
        });
      });
  }

  /*<!--
  <button class="button" style="padding: 0 7px 0 11px;">
                <div style="align-items: center; display: flex;">
                  <div style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; line-height: 20px;">
                    周一
                  </div><svg width="18" height="18" viewBox="0 0 24 24" focusable="false" style="margin-left: 8px;">
                    <path d="M7 10l5 5 5-5H7z"></path>
                  </svg>
                </div>
              </button>
  -->
  */
  static get observedAttributes() {
    return ['title'];
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
    if (attrName === 'title') {
      this.root.querySelector('.title').textContent = newVal;
    }
  }

}
customElements.define('custom-filter', CustomFilter);
/*
<!--\
<custom-filter></custom-filter>
<script src="custom-filter.js"></script>
const customFilter = document.querySelector('custom-filter');
const customFilter = document.createElement('custom-filter');
customFilter.setAttribute('title','');
document.body.appendChild(customFilter);
-->
*/