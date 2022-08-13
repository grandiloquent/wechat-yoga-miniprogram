class CustomToast extends HTMLElement {
    static get observedAttributes() {
        return ['message'];
    }
    // Fires when an instance of the element is created or updated
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'open'
        });
        const style = document.createElement('style');
        style.textContent = CustomToast.getStyle();
        this.root.appendChild(style);
        const c3Toast = document.createElement('DIV');
        c3Toast.setAttribute('class', 'c3-toast');

        const notificationActionRenderer = document.createElement('DIV');
        notificationActionRenderer.setAttribute('class', 'notification-action-renderer');
        const notificationActionResponseText = document.createElement('DIV');
        notificationActionResponseText.setAttribute('class', 'notification-action-response-text');
        notificationActionRenderer.appendChild(notificationActionResponseText);
        c3Toast.appendChild(notificationActionRenderer);
        this.root.appendChild(c3Toast);

        this.c3Toast = c3Toast;
        this.notificationActionResponseText = notificationActionResponseText;
        this.messages = [];
        this.timer = 0;
    }

    // Fires when an instance was inserted into the document
    connectedCallback() {}

    // Fires when an instance was removed from the document
    disconnectedCallback() {}

    showMessage() {
        if (this.messages.length && !this.showing) {
            const message = this.messages.shift();
            this.notificationActionResponseText.textContent = message;
            this.c3Toast.setAttribute('dir', 'in');
            this.showing = true;
            if (this.timer) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.c3Toast.setAttribute('dir', 'out');
                setTimeout(() => {
                    this.showing = false;
                    this.showMessage();
                }, 195);
            }, 3000);
        }
    }
    // Fires when an attribute was added, removed, or updated
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'message') {
            this.messages.push(newVal);
            this.showMessage();
        }
    }

    // Fires when an element is moved to a new document
    adoptedCallback() {}
    static getTemplate(value) {
        return `
        ${CustomToast.getStyle()}
        <div>
            ${value}
        </div>
        `;
    }
    static getStyle() {
        return `
        .c3-toast[dir="in"] {
            transition: margin 225ms cubic-bezier(0.0, 0.0, 0.2, 1);
            margin-bottom: 0;
        }
        
        .c3-toast[dir="out"] {
            transition: margin 195ms cubic-bezier(0.4, 0.0, 1, 1);
        }
        
        .c3-toast {
            display: block;
            position: fixed;
            z-index: 4;
            left: 0;
            right: 0;
            bottom: 0;
            box-sizing: border-box;
            padding: 14px 24px;
            font-size: 1.4rem;
            color: #ffffff;
            background: hsl(0, 0%, 20%);
            will-change: transform;
            margin-bottom: -100%;
        }
        
        .notification-action-renderer {
            display: flex;
            align-items: center;
        }
        
        .notification-action-response-text {
            flex-grow: 1;
            padding-right: 1rem;
            font-size:14px;
        }
        
        `;
    }
}
customElements.define('custom-toast', CustomToast);

/*
<!--
<custom-toast id="toast"></custom-toast>
<script src="components/toast.js"></script>
document.getElementById('toast').setAttribute('message','成功');
-->
*/
let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
let timer, token;
const phone = document.querySelector('#phone');
const captcha = document.querySelector('#captcha');
const captchaButton = document.querySelector('.verification');

function initializePhoneNumberInput() {
    const clearButton = phone.nextSibling.nextSibling;
    phone.addEventListener('input', evt => {
        if (/^\d{11}$/.test(phone.value)) {
            notice.textContent = '';
            captchaButton.style.color = '#e2231a';
            captcha.removeAttribute('disabled')
        } else if (/^\d{0,11}$/.test(phone.value)) {
            notice.textContent = '';
        } else if (/\D+/.test(phone.value) || /^\d{11,}$/.test(phone.value)) {
            notice.textContent = '请输入正确的手机号码';
            captcha.setAttribute('disabled', '');
            captchaButton.removeAttribute('style')
        }
        if (phone.value.length > 0) {
            clearButton.style.visibility = 'visible';
        } else {
            clearButton.style.visibility = 'hidden';
        }
    })

    clearButton.addEventListener('click', evt => {
        phone.value = '';
        clearButton.style.visibility = 'hidden';
        captcha.setAttribute('disabled', '');
        captcha.value = "";
        captcha.nextSibling.nextSibling.style.visibility = 'hidden';
        captchaButton.removeAttribute('style');
    })
}
initializePhoneNumberInput();

setInputs(captcha, captcha.nextSibling.nextSibling);


const notice = document.querySelector('.notice');








button = document.querySelector('.button');
button.addEventListener('click', async evt => {
    const p = phone.value;
    const code = captcha.value;
    if (/^\d{11}$/.test(p) && /^\d{6}$/.test(code)) {
        try {
            const response = await fetch(`${baseUri}/api/login?phone=${p}&code=${code}`);
            const url = new URL(window.location);
            url.searchParams.append('id', await response.text());
            window.location = url;
        } catch (error) {

        }
    }

});


function setInputs(input, clear) {
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

function setVerificationCodeInput() {
    captcha.addEventListener('input', evt => {
        if (input.value.length > 0) {
            clear.style.visibility = 'visible';
        } else {
            clear.style.visibility = 'hidden';
        }
    });
}





initialize();

async function initialize() {
    test();
    goBack();
    fetchToken();
    setCaptchaInput();
    setSendCaptchaButton();
    //fetch(`${baseUri}/api/token`);
}

//////////////////////////////////////////////////////

async function fetchToken() {
    // token = document.cookie.replace(/(?:^|.*;\s*)Token\s*=\s*([^;]*).*$|^.*$/, "$1");
    // if (!token) {
        
    // }
    await fetch(`${baseUri}/api/token`)
}
function goBack() {
    const goBackButton = document.querySelector('#go-back-button');
    goBackButton.addEventListener('click', evt => {
        history.back();
    })
}
function setCaptchaInput() {
    // If the captcha meets the requirements, 
    // change the color of the submit button
    captcha.addEventListener('input', evt => {
        if (validateCaptcha(captcha.value)) {
            button.style.backgroundImage = 'linear-gradient(90deg,#f10000,#ff2000 73%,#ff4f18)';
        } else {
            button.removeAttribute('style');
        }
    })
}
function test() {
    phone.value = '15348313821';
    phone.nextSibling.nextSibling.style.visibility = 'visible';
    captchaButton.style.color = '#e2231a';
    captcha.removeAttribute('disabled');
    captcha.value = '111111';
    captcha.nextSibling.nextSibling.style.visibility = 'visible';
    button.style.backgroundImage = 'linear-gradient(90deg,#f10000,#ff2000 73%,#ff4f18)';
}
function validateCaptcha(string) {
    console.log(string)
    return /^\d{6}$/.test(string)
}
function validatePhone(string) {
    return /^\d{11}$/.test(string)
}
function setSendCaptchaButton() {
    captchaButton.addEventListener('click', async evt => {
        if (validatePhone(phone.value)) {
            notice.textContent = '';

            console.log(((new Date() / 1000 | 0) - parseInt(localStorage.getItem('freeze') || '0')), parseInt(localStorage.getItem('freeze') || '0'))
            if (((new Date() / 1000 | 0) - parseInt(localStorage.getItem('freeze') || '0')) > 60) {
                await sendMessage(phone.value);
                captchaButton.style.color = 'rgba(0,0,0,.35)'
                captchaButton.textContent = '60秒后重发';
                localStorage.setItem('freeze', new Date() / 1000 | 0)
                let count = 59;
                clearInterval(timer);
                timer = setInterval(() => {
                    captchaButton.textContent = `${count--}秒后重发`;
                    if (count === 0) {
                        clearInterval(timer);
                        captchaButton.style.color = '#e2231a';
                        captchaButton.textContent = '获取验证码';
                        localStorage.setItem('freeze', 0)
                    }
                }, 1000);
            }

        } else {
            notice.textContent = '请输入正确的手机号码';
        }
    });
}

async function sendMessage(phone) {
    const response = await fetch(`${baseUri}/api/message?phone=${phone}`);
    return response.text();
}
