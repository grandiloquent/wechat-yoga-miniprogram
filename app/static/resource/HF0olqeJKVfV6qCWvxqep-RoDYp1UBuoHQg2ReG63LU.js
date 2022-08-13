class CustomBottom extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'open'
        });

        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        document.body.appendChild(wrapper);
        const item = document.createElement('div');
        item.setAttribute("class", "item");
        wrapper.appendChild(item);
        const a = document.createElement('a');
        a.setAttribute("href", "./index");
        a.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");
        item.appendChild(a);
        const img = document.createElement('div');
        img.setAttribute("class", "img");
        item.appendChild(img);
        const img1 = document.createElement('img');
        img1.setAttribute("src", "https://static.lucidu.cn/images/home-off.png");
        img.appendChild(img1);
        const text = document.createElement('div');
        text.setAttribute("class", "text");
        item.appendChild(text);
        text.textContent = "首页";
        const item2 = document.createElement('div');
        item2.setAttribute("class", "item");
        wrapper.appendChild(item2);
        const a3 = document.createElement('a');
        a3.setAttribute("href", "./appointment");
        a3.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");
        item2.appendChild(a3);
        const img4 = document.createElement('div');
        img4.setAttribute("class", "img");
        item2.appendChild(img4);
        const img5 = document.createElement('img');
        img5.setAttribute("src", "https://static.lucidu.cn/images/yueke.png");
        img4.appendChild(img5);
        const text6 = document.createElement('div');
        text6.setAttribute("class", "text");
        item2.appendChild(text6);
        text6.textContent = "约课";
        const item7 = document.createElement('div');
        item7.setAttribute("class", "item");
        wrapper.appendChild(item7);
        const a2 = document.createElement('a');
        a2.setAttribute("href", "./booked");
        a2.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");

        item7.appendChild(a2)

        const img8 = document.createElement('div');
        img8.setAttribute("class", "img");
        item7.appendChild(img8);
        const img9 = document.createElement('img');
        img9.setAttribute("src", "https://static.lucidu.cn/images/check-in.png");
        img8.appendChild(img9);
        const text10 = document.createElement('div');
        text10.setAttribute("class", "text");
        item7.appendChild(text10);
        text10.textContent = "已约";
        const item11 = document.createElement('div');
        item11.setAttribute("class", "item");
        wrapper.appendChild(item11);
        const a5 = document.createElement('a');
        a5.setAttribute("href", "./user");
        a5.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");

        item11.appendChild(a5)

        const img12 = document.createElement('div');
        img12.setAttribute("class", "img");
        item11.appendChild(img12);
        const img13 = document.createElement('img');
        img13.setAttribute("src", "https://static.lucidu.cn/images/my-off.png");
        img12.appendChild(img13);
        const text14 = document.createElement('div');
        text14.setAttribute("class", "text");
        item11.appendChild(text14);
        text14.textContent = "我的";

        wrapper.insertAdjacentHTML('afterbegin', CustomBottom.style());
        this.root.appendChild(wrapper);

        this.item = item;
        this.item1 = item2;
        this.item2 = item7;
        this.item3 = item11;

    }


    static get observedAttributes() {
        return ['selected'];
    }

    connectedCallback() {
        if (this.selected === '1') {
            this.item.className = 'item active';
            this.item.querySelector('img').src = 'https://static.lucidu.cn/images/home-on.png'
        } else if (this.selected === '2') {
            this.item1.className = 'item active';
            this.item1.querySelector('img').src = 'https://static.lucidu.cn/images/yueke-on.png'
        } else if (this.selected === '3') {
            this.item2.className = 'item active';
            this.item2.querySelector('img').src = 'https://static.lucidu.cn/images/check-in-on.png'
        } else if (this.selected === '4') {
            this.item3.className = 'item active';
            this.item3.querySelector('img').src = 'https://static.lucidu.cn/images/my-on.png'
        }
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'selected') {
            this.selected = newVal;
        }
    }

    static style() {
        return `
        <style>
.wrapper
{
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    z-index: 3;
    height: 48px;
    border-top: 1px solid rgba(0,0,0,.1);
    background: rgba(255,255,255,.98);
    color: #030303;
    font-size: 12px;
}
.text
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
.active .text
{
    color: #749b15;
}
.img
{
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke: none;
    color: #030303;
    display: block;
}
.img>img{
width: 100%;
}
.item
{
    display: flex;
    -webkit-box-flex: 1;
    flex: 1 1 0%;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}
        </style>`;
    }
}

customElements.define('custom-bottom', CustomBottom);
/*
<!--
<script src="bottom.js"></script>
<custom-bottom></custom-bottom>
const customCustomBottom = document.querySelector('custom-bottom');
-->
*/
class CustomLogin extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomLogin.template();
        this.container.style = 'background:#fff;position:fixed;z-index:1;top:0;right:0;left:0;bottom:0;';

    }


    static get observedAttributes() {
        return ['text'];
    }

    setInputs(input, clear) {
        input.addEventListener('input', evt => {
            if (input.value.length > 0) {
                clear.style.visibility = 'visible';
            } else {
                clear.style.visibility = 'hidden';
            }
        });
        clear.addEventListener('click', evt => {
            input.value = '';
            clear.style.visibility = 'hidden';
        })
    }

    connectedCallback() {

        // this.dispatchEvent(new CustomEvent());

        this.phone = this.root.querySelector('#phone');
        this.verification = this.root.querySelector('#verification');

        this.setInputs(this.phone, this.phone.nextSibling.nextSibling);
        this.setInputs(this.verification, this.verification.nextSibling.nextSibling);


        this.notice = this.root.querySelector('.notice');


        this.phone.addEventListener('input', evt => {
            if (/^\d{11}$/.test(this.phone.value)) {
                this.notice.textContent = '';
                this.verification.style.color = '#e2231a';
            } else if (/^\d{0,11}$/.test(this.phone.value)) {
                this.notice.textContent = '';
            } else if (/\D+/.test(this.phone.value) || /^\d{11,}$/.test(this.phone.value)) {
                this.notice.textContent = '请输入正确的手机号码';
            }
        })

        this.verification = this.root.querySelector('.verification');
        this.verification.addEventListener('click', evt => {
            if (/^\d{11}$/.test(this.phone.value)) {
                this.notice.textContent = '';
            } else {
                this.notice.textContent = '请输入正确的手机号码';
            }
        }); //

        const ver = this.root.querySelector('#verification');
        ver.addEventListener('input', evt => {
            if (ver.value.length === 6) {
                this.button.style.backgroundImage = 'linear-gradient(90deg,#f10000,#ff2000 73%,#ff4f18)';
            }
        })

        this.button = this.root.querySelector('.button');
        this.button.addEventListener('click', evt => {
            const phone = this.phone.value;
            const code = ver.value;
            console.log(phone, code);
            fetch('/api/message');
        });

        this.token = document.cookie.replace(/(?:^|.*;\s*)token\s*=\s*([^;]*).*$|^.*$/, "$1");
        if (!this.token) {
            fetch(`/api/token`)
        }

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'show') {
            this.root.querySelector('.wrapper').style.transform = 'translateX(250px)';
        }
    }

    static template() {
        return `
    <style>
::-webkit-input-placeholder
{
    color: #ccc;
}
.button
{
    background-image: linear-gradient(90deg,#fab3b3,#ffbcb3 73%,#ffcaba);
    width: 100%;
    height: 50px;
    border-radius: 25px;
    display: flex;
    align-items: center;
    color: #fff;
    justify-content: center;
}
.notice
{
    font-size: 14px;
    color: #f23030;
    min-height: 15px;
}
.input
{
    outline: none;
    line-height: 29px;
    border: 0;
    font-size: 16px;
    flex-grow: 1;
}
.header
{
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.title
{
    flex-grow: 1;
    text-align: center;
}
.input-wrapper
{
    margin-top: 20px;
    padding: 10px 0;
    border-bottom: 1px solid #efefef;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.clear
{
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: 0;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAHlBMVEUAAADMzMzNzc3Nzc3Nzc3MzMzMzMzPz8/Ozs7Nzc2Z5bCdAAAACnRSTlMA/lXB0M9LSiopP4KJtgAAAH5JREFUOMtjGAWkgslhMFapBYqEoaAChMEkKIwiESgoBGEoCoqgSBQKCipANAiKwQWhAkJgDSAFcAATgcljaIFJY2qByGLRAtWAqQWqAVMLVAOmFoQGwhIIowhZTti5CA8SDBLMQCQu2BNxRZQjWtQSTgyTw2GsEguGUUAiAAAoUA/JvBWTsAAAAABJRU5ErkJggg==);
    visibility: hidden;
}
.verification
{
    border-left: 1px solid #ccc;
    width: 110px;
    text-align: center;
    font-size: 14px;
    color: #848689;
}
    </style>

    <div style="padding: 0 12px;position:relative">
      <div class="header">
        <div style="position:absolute;width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; color: #70757a;left:0;left:12px">
          <svg style="width: 24px; height: 24px; fill: currentColor;" viewBox="0 0 24 24">
            <path d="M11.672 3.891l-8.109 8.109 8.109 8.109-1.781 1.781-9.891-9.891 9.891-9.891z">
            </path>
          </svg>
        </div>
        <div class="title">
          登录
        </div>
      </div>
      <div class="input-wrapper">
        <input id="phone" class="input" placeholder="请输入手机号码" />
        <div class="clear">
        </div>
      </div>
      <div class="input-wrapper">
        <input id="verification" class="input" placeholder="请输入手机号码" />
        <div class="clear">
        </div>
        <div class="verification">
          获取验证码
        </div>
      </div>
      <div id="notice" class="notice">
      </div>
      <div class="notice">
      </div>
      <div class="button">
        登 录
      </div>
    </div>
  
   `;
    }

    static style() {
        return `
        <style>
       
        </style>`;
    }


}

customElements.define('custom-login', CustomLogin);
/*
<!--
<script src="login.js"></script>
<custom-login></custom-login>
const customCustomLogin = document.querySelector('custom-login');
const customCustomLogin = document.createElement('custom-login');
-->
*/
function createLessonHistory(count, lessonName) {
    const div = document.createElement('div');
    div.setAttribute("class", "item");
    document.body.appendChild(div);
    const div1 = document.createElement('div');
    div.appendChild(div1);
    div1.textContent = count;
    const div2 = document.createElement('div');
    div.appendChild(div2);
    div2.textContent = lessonName;
    return div;
}

const lessonHistory = document.getElementById('lesson-history');
[
    { count: 0, lessonName: '团课' },
    { count: 0, lessonName: '私教' },
    { count: 0, lessonName: '小班' },
].forEach(x => {
    lessonHistory.appendChild(createLessonHistory(x.count, x.lessonName));
});
document.getElementById('user').addEventListener('click', evt => {
    window.location = '/profile';
})
