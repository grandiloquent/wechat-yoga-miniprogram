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