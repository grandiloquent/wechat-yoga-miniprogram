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
}
.item-svg
{
    padding: 0 15px;
    margin-bottom: 3px;
    width: 24px;
    vertical-align: middle;
}</style>
    <!-- Navigation Button -->
    <div style="position: fixed; top: 0; z-index: 1;">
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
          </a> <a class="item" href="index">
            <svg class="item-svg" fill="#757575" height="24px" viewbox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z">
              </path>
              <path d="M0 0h24v24H0z" fill="none">
              </path></svg> 首页
          </a> <a class="item" href="schedule">
            <svg class="item-svg" fill="#757575" height="24px" viewbox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.984 20.016v-11.016h-13.969v11.016h13.969zM18.984 3.984q0.797 0 1.406 0.609t0.609 1.406v14.016q0 0.797-0.609 1.383t-1.406 0.586h-13.969q-0.844 0-1.43-0.563t-0.586-1.406v-14.016q0-0.797 0.586-1.406t1.43-0.609h0.984v-1.969h2.016v1.969h7.969v-1.969h2.016v1.969h0.984zM17.016 11.016v1.969h-2.016v-1.969h2.016zM12.984 11.016v1.969h-1.969v-1.969h1.969zM9 11.016v1.969h-2.016v-1.969h2.016z">
              </path></svg> 排课
          </a><a class="item" href="lessons"> <svg class="item-svg" fill="#757575" height="24px" viewbox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" /></svg> 课程
          </a> <a class="item" href="teacher">
            <svg class="item-svg" fill="#757575" height="24px" viewbox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.641 0-2.813-1.172t-1.172-2.813 1.172-2.836 2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172z">
              </path></svg> 老师
          </a> <a class="item" href="settings">
            <svg class="item-svg" fill="#757575" height="24px" viewbox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z">
              </path></svg> 设置
          </a>
        </div>
      </div>
      <!-- Overlay -->
    </div>
    <!-- Navigation Button -->`;
    // https://fonts.google.com/icons?icon.set=Material+Icons
    const drawer = this.root.querySelector('#drawer');
    drawer.addEventListener('click', evt => {
      drawer.querySelector('div').style.transform = 'translateX(0px)'
      drawer.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      setTimeout(() => {
        drawer.style.display = 'none';
      }, 300);
      this.dispatchEvent(new CustomEvent('collapse'))
    });

    const navButton = this.root.querySelector('#nav-button');
    navButton.addEventListener('click', evt => {
      evt.stopPropagation();
      drawer.style.display = 'block';
      drawer.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
      setTimeout(() => {
        drawer.querySelector('div').style.transform = 'translateX(250px)'
      }, 100);
      this.dispatchEvent(new CustomEvent('expand'))
    });

  }
}

customElements.define('custom-drawer', CustomDrawer);
/*
<!--
<custom-drawer></custom-drawer>
-->
*/