class CustomDrawer extends HTMLElement {
  constructor() {
    super();
    this.root = this.attachShadow({ mode: 'closed' });
  }
  connectedCallback() {
    this.root.innerHTML = `<style>#nav-button
{
    outline: 0;
    padding: 18px;
}
#drawer
{
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 199;
    display: none;
    background-color: rgba(0,0,0,.6);
}
.icon
{
    padding: 0 15px;
    margin-bottom: 3px;
    width: 24px;
    vertical-align: middle;
}
.item
{
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0,0,0,.1);
    display: flex;
    align-items: center;
    color: rgba(0,0,0,.54);
    height: 48px;
    line-height: 20px;
    width: 100%;
    vertical-align: middle;
    outline: 0;
}</style>
    <!-- Navigation Button -->
    <div style="position: absolute; top: 0;">
      <div id="nav-button">
        <svg style="fill: #70757a; width: 24px; height: 24px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none">
          </path>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z">
          </path>
        </svg>
      </div>
      <!-- Overlay -->
      <div id="drawer">
        <div style="background-color: #fff; height: 100%; font-size: 16px; left: -250px; outline: none; overflow-y: scroll; padding-top: 15px; position: fixed; top: 0; transition: .5s; width: 250px; z-index: 200;">
          <a style="color: #1558d6; text-decoration: none; -webkit-tap-highlight-color: rgba(0,0,0,.1); background-position: 0 -374px; height: 36px; width: 92px; background-size: 167px; display: block; margin-left: 15px; padding-bottom: 8px; outline: 0;">
          </a> <a class="item" href="editor.html">
            <svg class="icon" fill="#757575" height="24px" viewbox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z">
              </path>
              <path d="M0 0h24v24H0z" fill="none">
              </path></svg> 首页
          </a>
        </div>
      </div>
      <!-- Overlay -->
    </div>
    <!-- Navigation Button -->`;
    const drawer = this.root.querySelector('#drawer');
    drawer.addEventListener('click', evt => {
      drawer.querySelector('div').style.transform = 'translateX(0px)'
      drawer.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      setTimeout(() => {
        drawer.style.display = 'none';
      }, 300);
    });

    const navButton = this.root.querySelector('#nav-button');
    navButton.addEventListener('click', evt => {
      evt.stopPropagation();
      drawer.style.display = 'block';
      drawer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      setTimeout(() => {
        drawer.querySelector('div').style.transform = 'translateX(250px)'
      }, 100);
    });

  }
}

customElements.define('custom-drawer', CustomDrawer);
/*
<!--
<custom-drawer></custom-drawer>
-->
*/