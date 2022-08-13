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
class CustomItemHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        const div = document.createElement('div');
        div.setAttribute("style", "user-select: none;border-bottom: 8px solid #f1f3f4");
        this.root.appendChild(div);
        const div1 = document.createElement('div');
        div1.setAttribute("style", "padding:16px;color: rgba(0,0,0,.87);font-size: 18px;height: 24px;line-height: 24px;");
        div.appendChild(div1);

        const slot = document.createElement('slot');
        div.appendChild(slot);

        this.content = div1;
        this.container = div;
    }


    static get observedAttributes() {
        return ['date', 'borderless', 'thin-border'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'date') {
            const date = new Date(parseInt(newVal) * 1000);
            this.content.textContent = `${date.getMonth() + 1}月${date.getDate()}日周${"日一二三四五六".split('')[date.getDay()]}`;
        } else if (attrName === 'borderless') {
            this.container.style.border = 'none';
        }else if (attrName === 'thin-border') {
            this.container.style.borderBottom = '1px solid #f1f3f4';
        }
    }

}

customElements.define('custom-item-header', CustomItemHeader);
/*
<!--
<script src="item-header.js"></script>
<custom-item-header></custom-item-header>
const customItemHeader = document.querySelector('custom-item-header');
const customItemHeader = document.createElement('custom-item-header');
customItemHeader.setAttribute('',JSON.stringify(obj));
-->
*/
class CustomItem extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.setAttribute("style", "user-select: none;border-top: 1px solid #e8eaed; padding:12px 16px; ");
        this.root.appendChild(div);
        const div1 = document.createElement('div');
        div1.setAttribute("style", "display: flex;");
        div.appendChild(div1);
        const img = document.createElement('img');
        img.setAttribute("style", "width: 92px; height: 92px; margin-right: 16px; border-radius: 8px;");
        div1.appendChild(img);
        const div2 = document.createElement('div');
        div2.setAttribute("style", "flex-grow: 1;");
        div1.appendChild(div2);
        const div3 = document.createElement('div');
        div3.setAttribute("style", "color: #5f6368; font-size: 12px; line-height: 16px; display: flex; align-items: center;");
        div2.appendChild(div3);

        /*
        const div4 = document.createElement('div');
        div3.appendChild(div4);
        const div5 = document.createElement('div');
        div5.setAttribute("style", "font-size: 12px; padding: 0 8px 0 6px; opacity: .6; min-width: 10px; text-align: center;");
        div3.appendChild(div5);
        div5.textContent = `•`;
        */

        const div6 = document.createElement('div');
        div3.appendChild(div6);

        const a = document.createElement('a');
        //a.setAttribute("href", "./lesson?id=${x.course_id}");
        a.setAttribute("style", "color: #202124; font-size: 16px; line-height: 24px; padding-top: 8px;text-decoration: none;");
        div2.appendChild(a);
        //a.textContent = `${x.lesson_name}`;
        const div7 = document.createElement('div');
        div7.setAttribute("style", "display:flex;padding:8px 0 0 0");
        div.appendChild(div7);
        const div8 = document.createElement('div');
        div8.setAttribute("style", "flex-grow:1");
        div7.appendChild(div8);
        const div9 = document.createElement('div');
        div9.style.border = "1px solid #dadce0";
        div9.style.borderRadius = "16px";
        div9.style.color = "#5f6368";
        div9.style.display = "inline-flex";
        div9.style.fontSize = "12px";
        div9.style.height = "24px";
        div9.style.lineHeight = "24px";
        div9.style.padding = "2px 12px";
        div7.appendChild(div9);
        this.img = img;


        this.subtitle = div6;
        this.a = a;
        this.button = div9;
    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const weeks = "日一二三四五六".split('');

            const obj = JSON.parse(newVal);
            //obj.reservation_id = 1;
            // obj.start_time = 8 * 3600;
            // obj.end_time = 9 * 3600;
            this.img.setAttribute("src", `https://static.lucidu.cn/images/${obj.thumbnail}`);

            //this.dateString.textContent = `${date.getMonth() + 1}月${date.getDate()}日周${weeks[date.getDay()]}`;
            this.subtitle.textContent = `${(obj.start_time / 3600) | 0}:${((obj.start_time % 3600 / 60) | 0).toString().padStart(2, '0')}-${(obj.end_time / 3600) | 0}:${((obj.end_time % 3600 / 60) | 0).toString().padStart(2, '0')}`;
            this.a.textContent = `${obj.lesson_name}`;
            this.a.setAttribute('href', `/lesson?id=${obj.course_id}`);

            if (this.checkIfExpired(obj)) {
                return;
            }

            if (this.checkIfBooked(obj)) {
                return;
            }

            this.button.textContent = "预约";
        }
    }

    checkIfExpired(obj) {
        if (obj.hidden === 2) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "已取消";
            return true;
        }
        if (obj.reservation_id) {
            return false;
        }

        const start = obj.date_time + obj.start_time;
        const seconds = (new Date() / 1000 | 0);
        const dif = start - seconds;
        const end = obj.date_time + obj.end_time - seconds;
        if (dif > 0 && dif < 3600) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "准备上课";
            return true;
        } else if (end > 0 && end < 3600) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "正在上课";
            return true;
        } else if (dif <= 0) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "已完成";
            return true;
        }
        this.button.textContent = "预约";
        this.button.addEventListener("click", evt => {
            this.dispatchEvent(new CustomEvent('touch', {
                detail: {
                    mode: 1,
                    course_id: obj.course_id,
                }
            }))
        })
        return true;
    }

    checkIfBooked(obj) {
        if (!obj.reservation_id) {
            return false;
        }
        const start = obj.date_time + obj.start_time;
        const seconds = (new Date() / 1000 | 0);
        const dif = start - seconds;
        const end = obj.date_time + obj.end_time - seconds;

        if (dif > 3600 * 3) {
            //return false;
            if (obj.peoples >= obj.position) {
                this.button.textContent = "取消候补";
            }
            else
                this.button.textContent = "取消预约";
            this.button.addEventListener("click", evt => {
                this.dispatchEvent(new CustomEvent('touch', {
                    detail: {
                        mode: 2,
                        reservation_id: obj.reservation_id,
                        course_id: obj.course_id
                    }
                }));
            })
            return true;
        } else if (dif > 0 && dif < 3600) {
            this.button.textContent = "准备上课";
        } else if (end > 0 && end < 3600) {
            this.button.textContent = "正在上课";
        } else if (dif <= 0) {
            this.button.textContent = "已完成";
        } else {
            this.button.textContent = "已预约";
        }
        this.button.style.background = "#f1f3f4";
        this.button.style.color = "#5f6368";
        return true;
    }

    checkIfPrepare(obj) {

    }

}

customElements.define('custom-item', CustomItem);
/*
<!--
<script src="components/item.js"></script>
<custom-item></custom-item>
const customCustomItem = document.querySelector('custom-item');
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
const id = new URL(window.location).searchParams.get('id') || 1;
let userId = new URL(window.location).searchParams.get('userId') || getCookie("UserId");

let items = document.getElementById('items');
const thumbnail = document.querySelector('#thumbnail');
const teacherName = document.querySelector('#teacher-name');
const introduction = document.querySelector('#introduction');
const introductionButton = document.querySelector('#introduction-button');
const phoneButton = document.querySelector('#phone-button');

async function loadData() {
    const startTime = new Date().setHours(0, 0, 0, 0) / 1000;
    const endTime = 86400 * 7 + startTime;
    const response = await fetch(`${baseUri}/api/reservation?mode=10&id=${id}&userId=${userId}&startTime=${startTime}&endTime=${endTime}&classType=4`);
    return response.json();
}


async function render() {
    items.innerHTML = '';
    try {
        const obj = await loadData();
        console.log(obj)
        // empty.style.display = 'none';introduction

        introductionButton.setAttribute('href', `/introduction?id=${id}`);
        phoneButton.setAttribute('href', `tel:${obj.teacher.phone_number || '15348313821'}`)

        thumbnail.setAttribute('src', `https://static.lucidu.cn/images/${obj.teacher.thumbnail}`);
        teacherName.textContent = obj.teacher.name;
        document.title = obj.teacher.name
        introduction.textContent = obj.teacher.introduction;

        const g = groupByKey(obj.lessons, 'date_time');

        Object.keys(g).sort().reverse().forEach(key => {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                const customItem = document.createElement('custom-item');
                customItem.setAttribute('data', JSON.stringify(x));
                customItem.addEventListener('touch', async evt => {
                    await executeBooking(customItem, evt);
                    await executeUnBooking(customItem, evt);
                })
                customItemHeader.appendChild(customItem);
            });
            items.insertAdjacentElement('afterbegin', customItemHeader);
        })
    } catch (e) {
        //empty.style.display = 'flex';
        console.log(e);
    }
}

render();


async function executeBooking(element, evt) {
    if (evt.detail.mode === 1) {
        try {
            await booking(evt.detail.course_id, userId);
            await updateItem(element, evt);
        } catch (e) {
            console.log(e)
            document.getElementById('toast').setAttribute('message', '无法预约');
        }
    }
}

async function updateItem(element, evt) {
    const x = await queryBooking(evt.detail.course_id, userId);
    const customItem = document.createElement('custom-item');
    customItem.setAttribute('data', x);
    customItem.addEventListener('touch', async evt => {
        await executeBooking(customItem,evt);
        await executeUnBooking(customItem, evt);
    });
    element.replaceWith(customItem);
}

function executeUnBooking(element, evt) {
    if (evt.detail.mode === 2) {
        const customDialog = document.createElement('custom-dialog');
        const div = document.createElement('div');
        div.textContent = '您确定要取消预约吗？'
        customDialog.appendChild(div);
        customDialog.addEventListener('submit', async ev => {
            try {
                await unBooking(evt.detail.reservation_id);
                await updateItem(element, evt);
            } catch (e) {
                document.getElementById('toast').setAttribute('message', '无法预约');
            }
        })
        document.body.appendChild(customDialog);

    }
}



