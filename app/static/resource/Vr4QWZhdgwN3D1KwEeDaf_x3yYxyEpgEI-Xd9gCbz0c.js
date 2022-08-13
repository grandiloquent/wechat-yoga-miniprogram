async function addJS(jsCode) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = jsCode;
    document.getElementsByTagName('head')[0].appendChild(s);
    return new Promise(((resolve, reject) => {
        s.onload = () => {
            resolve()
        }
        s.onerror = () => {
            reject()
        }
    }))
}
function calculateLoadedPercent(video) {
    if (!video.buffered.length) {
        return '0';
    }
    return (video.buffered.end(0) / video.duration) * 100 + '%';
}
function calculateProgressPercent(video) {
    return ((video.currentTime / video.duration) * 100).toFixed(2) + '%';
}
function camel(string) {
    return string.replaceAll(/[ _-]([a-zA-Z])/g, m => m[1].toUpperCase());
}
function clamp(x, min, max) {
    if (x > max) return max;
    if (x < min) return min;
    return x;
}
function dateToSeconds(string) {
    let match = /(\d+)年(\d+)月(\d+)日/.exec(string);
    if (!match) {
        match = /(\d+)月(\d+)日/.exec(string);
        const t = new Date();
        t.setMonth(parseInt(match[1]) - 1);
        t.setDate(parseInt(match[2]));
        t.setHours(0, 0, 0, 0)
        return t / 1000;
    } else {
        const t = new Date();
        t.setFullYear(parseInt(match[1]))
        t.setMonth(parseInt(match[2]) - 1);
        t.setDate(parseInt(match[3]));
        t.setHours(0, 0, 0, 0)
        return t / 1000;
    }

}
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function durationToSeconds(duration) {
    let result = 0;
    if (/(\d{1,2}:){1,2}\d{1,2}/.test(duration)) {
        const pieces = duration.split(':');
        for (let i = pieces.length - 1; i > -1; i--) {
            result += Math.pow(60, i) * parseInt(pieces[pieces.length - i - 1]);
        } console.log(result)
        return result;
    }
    result = parseInt(duration);
    if (isNaN(result)) {
        result = 0;
    }
    return result;
}
function formatDuration(ms) {
    if (isNaN(ms)) return '0:00';
    if (ms < 0) ms = -ms;
    const time = {
        hour: Math.floor(ms / 3600) % 24,
        minute: Math.floor(ms / 60) % 60,
        second: Math.floor(ms) % 60,
    };
    return Object.entries(time)
        .filter((val, index) => index || val[1])
        .map(val => (val[1] + '').padStart(2, '0'))
        .join(':');
}
function fuzzysearch(needle, haystack) {
    var hlen = haystack.length;
    var nlen = needle.length;
    if (nlen > hlen) {
        return false;
    }
    if (nlen === hlen) {
        return needle === haystack;
    }
    outer: for (var i = 0, j = 0; i < nlen; i++) {
        var nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                continue outer;
            }
        }
        return false;
    }
    return true;
}
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
function getShortDateString(seconds) {
    const t = new Date(seconds * 1000);
    return `${t.getMonth() + 1}月${t.getDate()}日周${'日一二三四五六'[t.getDay()]}`;
}
async function getStringAsync(uri, options) {
    const response = await fetch(uri, {
        method: 'GET',
        ...options
    });
    if (!response.ok) {
        throw new Error();
    }
    return await response.text();
}
function groupByKey(array, key) {
    return array
        .reduce((hash, obj) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) })
        }, {})
}
function kebab(string) {
    return string.replaceAll(/(?<=[a-z])[A-Z]/g, m => `_${m}`).toLowerCase()
        .replaceAll(/[ -]([a-z])/g, m => `-${m[1]}`)
}
function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
async function readText() {
    const string = await navigator.clipboard.readText();
    return string;
}
function secondsToDuration(seconds) {
    return `${(seconds / 3600) | 0}:${(seconds % 3600 / 60).toString().padStart(2, '0')}`
}
function snake(string) {
    return string.replaceAll(/(?<=[a-z])[A-Z]/g, m => `_${m}`).toLowerCase()
        .replaceAll(/[ -]([a-z])/g, m => `_${m[1]}`)
}
function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
function substringAfter(string, delimiter, missingDelimiterValue) {
    const index = string.indexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(index + delimiter.length);
    }
}
function substringAfterLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(index + delimiter.length);
    }
}
function substringBefore(string, delimiter, missingDelimiterValue) {
    const index = string.indexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(0, index);
    }
}
function substringBeforeLast(string, delimiter, missingDelimiterValue) {
    const index = string.lastIndexOf(delimiter);
    if (index === -1) {
        return missingDelimiterValue || string;
    } else {
        return string.substring(0, index);
    }
}
function touchMove(progressBar, ev) {
    const rect = progressBar.getBoundingClientRect();
    let precent = (ev.touches[0].clientX - rect.x) / (rect.width - 28) * 100;
    precent = clamp(precent, 0, 100);
    return precent;
}
function upperCamel(string) {
    string = camel(string);
    return string.slice(0, 1).toUpperCase() + string.slice(1);
}
function writeText(message) {
    const textarea = document.createElement("textarea");
    textarea.style.position = 'fixed';
    textarea.style.right = '100%';
    document.body.appendChild(textarea);
    textarea.value = message;
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
}

function secondsToDateString(seconds) {
    const t = new Date(seconds * 1000);
    return `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;
}
function reportError(err) {
    console.log(err)
}
// https://docs.rs/convert_case/latest/convert_case/
async function unBooking(id) {
    const response = await fetch(`${baseUri}/api/reservation.delete?id=${id}`);
    return response.text();
}
async function booking(id,userId) {
    const response = await fetch(`${baseUri}/api/reservation.insert?id=${id}&userId=${userId}`);
    return response.text();
}

async function queryBooking(id,userId) {
    const response = await fetch(`${baseUri}/api/reservation.query?id=${id}&userId=${userId}`);
    return response.text();
}

class CustomEmptyViewer extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `<style>.button
        {
            -webkit-tap-highlight-color: transparent;
            -webkit-font-smoothing: antialiased;
            -webkit-box-direction: normal;
            font: inherit;
            position: relative;
            display: inline-block;
            box-sizing: border-box;
            margin: 0;
            line-height: 1.2;
            text-align: center;
            cursor: pointer;
            transition: opacity .2s;
            -webkit-appearance: none;
            color: #fff;
            background-color: #ee0a24;
            border: 1px solid #ee0a24;
            padding: 0 15px;
            font-size: 14px;
            border-radius: 999px;
            width: 160px;
            height: 40px;
            display:flex;align-items: center;justify-content: center;
        }
        .empty__bottom
        {
            -webkit-tap-highlight-color: transparent;
            color: #323233;
            font-size: 16px;
            font-family: 'Open Sans',-apple-system,BlinkMacSystemFont,'Helvetica Neue',Helvetica,Segoe UI,Arial,Roboto,'PingFang SC','miui','Hiragino Sans GB','Microsoft Yahei',sans-serif;
            -webkit-font-smoothing: antialiased;
            -webkit-box-direction: normal;
            margin-top: 24px;
            
        }
        .wrapper
        {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 32px 0;
            flex-direction: column;
        }
        img
        {
            width: 160px;
            height: 160px;
        }
        .text
        {
            margin-top: 16px;
            color: #969799;
            font-size: 14px;
            line-height: 20px;
            padding: 0 60px;
        }</style>
            <div class="wrapper">
              <img />
              <div class="text">
                没有找到预约的课程
              </div>
              <div class="empty__bottom">
                <div class="button">
                </div>
              </div>
            </div>
		`;
    }

    get src() {
        return this.getAttribute('src');
    }
    get text() {
        return this.getAttribute('text');
    }
    get label() {
        return this.getAttribute('label');
    }
    static get observedAttributes() {
        return ['src', 'text', 'label'];
    }


    connectedCallback() {


        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
        this.img = this.root.querySelector('img');
        this.textRender = this.root.querySelector('.text');
        this.img.setAttribute('src', this.src || 'http://static.lucidu.cn/images/empty-image-default.png');
        this.textRender.textContent = this.text;
        this.button = this.root.querySelector('.button');

        if (this.label) {
            this.button.textContent = this.label;
            this.button.addEventListener('click', evt => {
                this.dispatchEvent(new CustomEvent('submit'));
            })
        } else {
            this.button.style.display = 'none';
        }


    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'src') {
            if (this.img)
                this.img.setAttribute('src', newVal);
        } else if (attrName === 'text') {
            if (this.img)
                this.img.textContent = newVal;
        }
    }

}
customElements.define('custom-empty-viewer', CustomEmptyViewer);
/*
<!--\
<custom-empty-viewer></custom-empty-viewer>
<script src="components/empty-viewer.js"></script>
const customEmptyViewer = document.querySelector('custom-empty-viewer');
const customEmptyViewer = document.createElement('custom-empty-viewer');
customEmptyViewer.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customEmptyViewer);
-->
*/
class CustomModalMenu extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    // static get observedAttributes() {
    //     return ['data'];
    // }


    connectedCallback() {
        
        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `<style>
        .menu-item-button
        {
            border: none;
            outline: none;
            font: inherit;
            color: inherit;
            background: transparent;
            cursor: pointer;
            box-sizing: border-box;
            display: block;
            font-size: 16px;
            padding: 9px 12px;
            text-align: initial;
            text-transform: unset;
            width: 100%;
        }
        .menu-item
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            color: #030303;
            display: block;
            padding: 3px 0;
        }
        .menu-content
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            position: relative;
            z-index: 2;
            max-height: 100%;
            overflow-y: auto;
            color: #030303;
            background-color: #f9f9f9;
            padding: 3px;
            min-width: 250px;
            max-width: 356px;
            margin: 40px;
        }
        .hidden-button
        {
            word-wrap: break-word;
            -webkit-text-size-adjust: 100%;
            padding: 0;
            border: none;
            outline: none;
            font: inherit;
            text-transform: inherit;
            color: inherit;
            background: transparent;
            cursor: pointer;
            position: fixed;
            top: 0;
            left: 0;
            height: 1px;
            width: 1px;
        }
        .c3-overlay
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            color: #030303;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1;
            cursor: pointer;
            background-color: rgba(0,0,0,.8);
        }
        .menu-container
        {
            font-family: Roboto,Arial,sans-serif;
            word-wrap: break-word;
            color: #030303;
            -webkit-text-size-adjust: 100%;
            font-size: 1.2rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            z-index: 4;
        }
      </style>
      <div class="menu-container">
      <div class="menu-content">
        <div class="menu-item">
          <div class="menu-item-button">
            取消
          </div>
        </div>
      </div>
      <div class="c3-overlay">
        <button class="hidden-button" aria-label="close">
        </button>
      </div>
    </div>
        `;
        const c3Overlay = this.root.querySelector('.c3-overlay');
        c3Overlay.addEventListener('click', evt => {
            this.remove();
        })
        const menuItem = this.root.querySelector('.menu-item:last-child');
        menuItem.addEventListener('click', evt => {
            this.remove();
        });
        const menuContent = this.root.querySelector('.menu-content');
        menuContent.insertAdjacentHTML('afterbegin',
            `        <div class="menu-item">
         <div class="menu-item-button">
           删除
         </div>
       </div>`);

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    // disconnectedCallback() {

    // }

    // attributeChangedCallback(attrName, oldVal, newVal) {
    //     if (attrName === 'data') {
    //         const obj = JSON.parse(newVal);
    //     }
    // }

}
customElements.define('custom-modal-menu', CustomModalMenu);
/*
<!--\
<custom-modal-menu></custom-modal-menu>
<script src="components/modal-menu.js"></script>
const customModalMenu = document.querySelector('custom-modal-menu');
const customModalMenu = document.createElement('custom-modal-menu');
customModalMenu.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customModalMenu);
-->
*/
class CustomDialog extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomDialog.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        this.root.querySelector('#close')
            .addEventListener('click', ev => {
                this.remove();
                this.dispatchEvent(new CustomEvent('close'));
            });
        this.root.querySelector('.wrapper')
            .addEventListener('click', ev => {
                this.remove();
                this.dispatchEvent(new CustomEvent('close'));
            });
        this.root.querySelector('.layout')
            .addEventListener('click', ev => {
                ev.stopPropagation();
                this.dispatchEvent(new CustomEvent('close'));
            });
        this.root.querySelector('#submit')
            .addEventListener('click', ev => {
                this.remove();
                this.dispatchEvent(new CustomEvent('submit'));
            });
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {

    }

    static template() {
        return `
        ${CustomDialog.style()}

    <div class="overlay">
    </div>
    <div class="wrapper">
      <div class="layout">
        <div class="content">
          <div class="top">
          <slot></slot>
          </div>
          <div class="buttons">
            <div id="close" class="button">
              取消
            </div>
            <div id="submit" class="button">
              确定
            </div>
          </div>
        </div>
      </div>
    </div>

   `;
    }

    static style() {
        return `
        <style>
.button
{
    margin-bottom: -1px;
    white-space: nowrap;
    flex: 0 0 auto;
    margin-right: 8px;
    min-width: 48px;
    padding: 0 8px;
    line-height: 36px !important;
    text-align: center;
    font-family: Roboto-Medium,HelveticaNeue-Medium,Helvetica Neue,sans-serif-medium,Arial,sans-serif !important;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #4285f4;
}
.buttons
{
    cursor: pointer;
    font-family: Roboto,Helvetica Neue,Arial,sans-serif;
    font-size: small;
    color: #4d5156;
    -webkit-text-size-adjust: none;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    white-space: normal;
    text-align: left;
    visibility: inherit;
    -webkit-user-select: none;
    display: flex;
    justify-content: flex-end;
    padding: 0 0 8px 0;
}
.top
{
    padding: 24px;
    font-size: 16px;
    overflow-wrap: break-word;
}
.content
{
    max-width: 300px;
    -webkit-user-select: none;
}
.layout
{
    border-radius: 8px;
    position: relative;
    display: inline-block;
    z-index: 1060;
    background-color: #fff;
    vertical-align: middle;
    white-space: normal;
    overflow: hidden;
    transform: translateZ(0);
    box-shadow: 0 5px 26px 0 rgba(0,0,0,.22),0 20px 28px 0 rgba(0,0,0,.3);
    text-align: left;
    opacity: 1;
    visibility: inherit;
    outline: 0;
}
.overlay
{
    position: fixed;
    z-index: 1001;
    right: 0;
    bottom: -200px;
    top: 0;
    left: 0;
    -webkit-transition: opacity .25s;
    background-color: #000;
    opacity: .4;
    visibility: inherit;
}
.wrapper
{
    position: fixed;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    z-index: 1002;
    vertical-align: middle;
    white-space: nowrap;
    max-height: 100%;
    max-width: 100%;
    overflow: auto;
    transform: translateZ(0);
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    text-align: center;
    opacity: 1;
    visibility: inherit;
}
.wrapper::after
{
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
}
        </style>`;
    }


}

customElements.define('custom-dialog', CustomDialog);

/*
<!--
<custom-dialog></custom-dialog>
<script src="components/dialog.js"></script>
const customDialog = document.createElement('custom-dialog');
    const input = document.createElement('input');
    customDialog.appendChild(input);
    customDialog.addEventListener('submit', ev => {
        input.value;
    })
    document.body.appendChild(customDialog);

        const customDialog = document.createElement('custom-dialog');
    const div = document.createElement('div');
    div.textContent = '您确定要停课吗？';
    customDialog.appendChild(div);
    customDialog.addEventListener('submit', ev => {
       
    })
    document.body.appendChild(customDialog);
-->
 */
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
const id = new URL(window.location).searchParams.get('id');
const edit = document.querySelector('#edit');
const qr = document.querySelector('#qr');
const section = document.querySelector('.section');



async function loadData() {
    const response = await fetch(`${baseUri}/api/user.vipcards?id=${id}`);
    return response.json();
}
const h1 = document.querySelector('.h1');


async function render() {
    let obj;
    try {
        obj = await loadData();

        h1.textContent = obj.user.name || obj.user.nick_name;
        document.querySelector('.top img').setAttribute('src', obj.user.avatar_url);
        document.querySelector('.h2').textContent = `${obj.user.phone || '153****3821'}`;
        if (obj.vipCards) {
            obj.vipCards.forEach(x => {

                const template = `<div data-id=${x.id} style="border-bottom: 1px solid #e5e5e5; padding: 12px 0; display: flex; flex-direction: row;">
            
            <svg style="width: 48px; height: 48px; border-radius: 8px; margin-right: 12px;fill:rgb(25, 103, 210)" viewBox="0 0 1024 1024" focusable="false">
                <path d="M910.222336 170.667008c31.403008 0 56.88832 25.486336 56.88832 56.88832v568.889344c0 31.459328-25.485312 56.88832-56.88832 56.88832H113.77664c-31.403008 0-56.88832-25.428992-56.88832-56.88832V227.555328c0-31.401984 25.485312-56.88832 56.88832-56.88832z m0 170.665984H113.77664v455.11168H910.22336V341.332992z m0-113.77664H113.77664v56.88832H910.22336v-56.889344zM245.588992 438.953984h43.350016l66.900992 198.656h1.024l66.900992-198.656h43.350016l-86.699008 243.712h-48.128l-86.699008-243.712z m247.126016 0h39.936v243.712h-39.936v-243.712z m87.721984 0H681.472c58.708992 0 88.404992 24.916992 88.404992 74.752 0 50.176-29.696 75.433984-89.088 75.433984h-60.416v93.526016h-39.936v-243.712z m39.936 34.132992v81.92H678.4c17.748992 0 30.72-3.412992 38.912-9.556992 8.192-6.486016 12.288-17.067008 12.288-31.744 0-14.678016-4.436992-24.918016-12.628992-31.062016C708.779008 476.16 695.808 473.088 678.4 473.088h-58.027008z">
                </path>
            </svg>
                <div style="font-size: 14px; flex-grow: 1;">
                    <div>${x.title}</div>
                    <div style="font-size:12px;color:rgba(3,3,3,.6);margin-top:4px">${secondsToDateString(x.start_date)}-${secondsToDateString(x.end_date)}</div>
                </div>
                <div class="more_vert" data-id=${x.id} 
                    style="display: inline-block; flex-shrink: 0; width: 48px; height: 48px; fill: currentColor; stroke: none; padding: 12px; box-sizing: border-box; color: #030303;">
                    <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                    <path
                        d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z">
                    </path>
                </svg>
                </div>
            </div>`;
                section.insertAdjacentHTML('afterbegin', template);

                /*<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                                        <path
                                            d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z">
                                        </path>
                                    </svg>*/
            });
            const moreVerts = document.querySelectorAll('.more_vert');
            moreVerts.forEach(moreVert => {
                moreVert.addEventListener('click', evt => {
                    const customModalMenu = document.createElement('custom-modal-menu');
                    document.body.appendChild(customModalMenu);
                })
            })
        } else {
            const customEmptyViewer = document.createElement('custom-empty-viewer');
            customEmptyViewer.setAttribute('text', '未找到相关会员卡');
            document.body.appendChild(customEmptyViewer);
        }



    } catch (e) {
        console.log(e)
        document.getElementById('toast').setAttribute('message', '无法加载。');
    }
}

render();



edit.addEventListener('click', evt => {
    window.location = `/admin.vipCard.edit?id=${id}`;

})

const backButton=document.querySelector('.back-button');
backButton.addEventListener('click',evt=>{
            history.back();
        })

