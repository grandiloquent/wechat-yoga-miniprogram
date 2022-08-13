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
class CustomWeekTab extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.active{
        color:#1a73e8;
        }`


        const div = document.createElement('div');

        div.style.justifyItems = "center";
        div.style.display = "grid";
        div.style.gridTemplateColumns = "repeat(7, 1fr)";
        div.style.fontSize = "12px";
        div.style.padding = "8px 12px 16px";
        div.style.background = "#fff";
        div.style.position = 'relative';

        this.root.appendChild(div);
        this.items = [];
        '一二三四五六日'.split('')
            .forEach(x => {
                const d = document.createElement('div');
                d.textContent = `周${x}`;
                div.appendChild(d);
                this.items.push(d);
            });
        const border = document.createElement('div');
        border.style.height = '3px';
        border.style.backgroundColor = '#1a73e';
        border.style.willChange = 'left,width';
        border.style.position = 'absolute';
        border.style.bottom = '10px';
        border.style.borderTopLeftRadius = "3px";
        border.style.borderTopRightRadius = "3px";
        border.style.backgroundColor = '#1a73e8';
        div.appendChild(border);
        this.border = border;
    }


    static get observedAttributes() {
        return ['select'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        this.items[0].className = 'active';
        this.scroll(this.items[0]);
        this.items.forEach((x, k) => {
            x.addEventListener('click', evt => {
                this.root.querySelector('.active').className = '';
                this.scroll(this.items[k]);
                this.dispatchEvent(new CustomEvent('touch', {
                    detail: k
                }))
            })
        })
    }

    scroll(element) {
        const r = element.getBoundingClientRect()
        this.border.style.width = r.width + 'px';
        this.border.style.left = r.x + 'px';
        element.className = 'active';
        this.border.style.transition = "left 0.15s cubic-bezier(0.4,0,1,1),width 0.15s cubic-bezier(0.4,0,1,1)";

    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'select') {
            this.root.querySelector('.active').className = '';
            this.scroll(this.items[parseInt(newVal)])
        }
    }

}

customElements.define('custom-week-tab', CustomWeekTab);
/*
<!--\
<custom-week-tab></custom-week-tab>
<script src="components/week-tab.js"></script>
const customWeekTab = document.querySelector('custom-week-tab');
const customWeekTab = document.createElement('custom-week-tab');
customWeekTab.setAttribute('',JSON.stringify(obj));
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
class CustomSwitcher extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `
        .button
        {
            border: 1px solid #dadce0;
        }
        .left
        {
            padding: 6px 20px 6px 24px;
            border-bottom-left-radius: 100px;
            border-top-left-radius: 100px;
            border-right: 0;
        }
        .right
        {
            padding: 6px 24px 6px 20px;
            border-bottom-right-radius: 100px;
            border-top-right-radius: 100px;
        }
        .active
        {
            background-color: #e8f0fe;
            color: #1967d2;
        }
            `


        const div = document.createElement('div');
        div.style.lineHeight = "20px";
        div.style.alignItems = "center";
        div.style.display = "flex";
        div.style.fontSize = "14px";
        div.style.paddingLeft = "8px";
        this.root.appendChild(div);

        const first = document.createElement('div');
        first.className = "button left active";

        div.appendChild(first);


        const second = document.createElement('div');
        second.className = 'button right'
        div.appendChild(second);
        second.textContent = `下周`;

        this.first = first;
        this.second = second;
    }


    static get observedAttributes() {
        return ['first-name', 'next-name'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());

        this.first.addEventListener('click', evt => {
            if (this.first.className.indexOf('active') !== -1) return;
            this.second.className = 'button right';
            this.first.className = 'button left active';
            this.dispatchEvent(new CustomEvent('touch', {
                detail: 0
            }));
        });

        this.second.addEventListener('click', evt => {
            if (this.second.className.indexOf('active') !== -1) return;
            this.second.className = 'button right active';
            this.first.className = 'button left';
            this.dispatchEvent(new CustomEvent('touch', {
                detail: 1
            }));
        })
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'first-name') {
            this.first.textContent = newVal;
        } else if (attrName === 'second-name') {
            this.second.textContent = newVal;
        }
    }

}
customElements.define('custom-switcher', CustomSwitcher);
/*
<!--
<script src="components/switcher.js"></script>
<custom-switcher></custom-switcher>
const customSwitcher = document.querySelector('custom-switcher');
const customSwitcher = document.createElement('custom-switcher');
customSwitcher.setAttribute('',JSON.stringify(obj));
-->
*/
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
/*
let baseUri = "";
let selected, todayIndex, selectedDateTime;
const dates = document.getElementById('dates');

function render(offset) {
    selected = 0;
    dates.innerHTML = '';
    const obj = getDates(offset || 0);
    const elements = [];
    obj.forEach((x, k) => {
        const div = document.createElement('div');
        let style = '';
        if (k === 0) {
            style = "border-top-left-radius: 4px;border-bottom-left-radius: 4px;";
        } else if (k === obj.length - 1) {
            style = "border-top-right-radius: 4px;border-bottom-right-radius: 4px;";
        }
        div.dataset.index = k;
        div.innerHTML = `<div style="width: 100%;display: flex;flex-direction: column;align-items: center;padding: 6px 0;background: #f3f3f3;${style}">
            <span>${x.week}</span>
            <div style="font-size: 18px;padding: 4px 0;">
                ${x.day}
            </div>
            <span>${x.month + 1}月</span>
        </div>`;
        div.dataset.time = x.time;
        elements.push(div);
        dates.appendChild(div);
        div.addEventListener('click', evt => {
            evt.stopPropagation();
            selectedDateTime = parseInt(evt.currentTarget.dataset.time)
            const idx = parseInt(evt.currentTarget.dataset.index);
            elements.forEach((v, j) => {
                if (j == idx) {
                    const d = v.querySelector('div');
                    d.style.background = '#749b15';
                    d.style.color = '#fff';
                } else {
                    const d = v.querySelector('div');
                    d.style.background = '#f3f3f3';
                    d.style.color = '#030303';
                }
            });
            loadData()
        });
    });
    const d = document.querySelector(`#dates>div[data-index='${selected}']>div`);
    d.style.background = '#749b15';
    d.style.color = '#fff';
}

render();
const nextWeek = document.getElementById('next-week');
const week = document.getElementById('week');
nextWeek.addEventListener('click', evt => {
    render(7);
    nextWeek.style.backgroundColor = '#e8f0fe';
    nextWeek.style.color = '#1967d2';
    week.style.backgroundColor = '#fff';
    week.style.color = ' #030303';
    loadData()
});
week.addEventListener('click', evt => {
    render(0);
    week.style.backgroundColor = '#e8f0fe';
    week.style.color = '#1967d2';
    nextWeek.style.backgroundColor = '#fff';
    nextWeek.style.color = ' #030303';
    loadData()
});
const items = document.getElementById('items');
const empty = document.getElementById('empty');

async function loadData() {
    const startTime = selectedDateTime;
    const id = new URL(window.location).searchParams.get('id');
    const response = await fetch(`${baseUri}/api/reservation?mode=1&id=0&startTime=${startTime || 0}&endTime=0&classType=4`);
    items.innerHTML = "";
    let obj = {};
    try {
        obj = await response.json();
    } catch (e) {
        empty.style.display = "flex";
        return;
    }
    empty.style.display = 'none';
    setLessonStatus(obj, 3, 60);
console.log(obj.sort((x, y) => {
    console.log(x.start_time,y.start_time)
    return x.start_time-y.start_time
}));
    obj.sort((x, y) => {
        return x.start_time - y.start_time
    }).forEach(x => {
        console.log(x.mode);
        const div = document.createElement('div');
        let str = '';
        let s1 = '';
        if (x.mode & 16) {
            str = `
<div style="position: absolute;padding:16px 16px 16px 17px;font-size: 15px;right: -16px;bottom: 0px;color: #70757a;">
准备上课
</div>`
        }
        if (x.mode & 8) {
            str = `<div style="color: #1558d6; position: absolute; padding: 16px 16px 16px 17px; font-size: 15px; right: -16px; bottom: 0;">
          预约
        </div>`
            s1 = `已预约 0/${x.peoples}`
        }
        if (x.mode & 4) {
            s1 = `${x.teacher_name}`;
        }
        if (x.mode & 1) {
            str = `
<div style="position: absolute;padding:16px 16px 16px 17px;font-size: 15px;right: -16px;bottom: 0px;color: #70757a;">
已完成
</div>`
        }

      
          div.innerHTML = `
          <div style="color: #202124; display: flex; background-color: #fff; margin: 0 0 10px 0; border-radius: 8px; flex-grow: 1; box-shadow: 0 0 0 1px #ebedef; padding-left: 16px; padding-right: 16px;">
            <div style="display: flex; justify-content: center; margin: 16px 16px 16px 0;">
              <img style="overflow: hidden; position: relative; border-radius: 8px; background-color: #f8f9fa; height: 92px; width: 92px;" src="https://static.lucidu.cn/images/${x.thumbnail}" />
            </div>
            <div style="flex-grow: 1; width: 0; position: relative; padding: 16px 0 40px;">
              <div style="font-size: 12px; font-weight: 400; line-height: 16px; overflow: hidden; text-align: left; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span>
                  ${((x.start_time) / 3600) | 0}:${(((x.start_time % 3600) / 60) | 0).toString().padStart(2, '0')}
                </span>
                <div style="color: #70757a;">
                  ${x.teacher_name}
                </div>
              </div>
              <div style="display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; white-space: normal; -webkit-line-clamp: 3;">
                ${x.lesson_name}
              </div>
              <div style="overflow: hidden; text-overflow: ellipsis; color: #70757a; line-height: 16px; position: absolute; width: calc(100% - 32px); padding: 0 16px; font-size: 12px; left: -16px; bottom: 16px;">
               ${s1}
              </div>
              ${str}
            </div>
          </div>
        `;
              items.appendChild(div);
          });
      }
      
      loadData();
      items.addEventListener('click', evt => {
      });
      
      function getDates(offset = 0) {
          const dates = [];
          const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          let todayDateTimestamp = today.getTime();
          let start = calculateStartTimestamp(todayDateTimestamp, today.getDay());
          for (let index = 0; index < 7; index++) {
              const timestamp = new Date((start + 86400 * (index + offset)) * 1000);
              if (index === 0) {
                  selectedDateTime = timestamp.getTime() / 1000
              }
              if (todayDateTimestamp === timestamp.getTime()) {
                  selected = index;
                  todayIndex = index;
                  selectedDateTime = timestamp.getTime() / 1000
              }
              dates.push({
                  id: index,
                  week: todayDateTimestamp === timestamp.getTime() ? '今日' : weeks[timestamp.getDay()],
                  day: timestamp.getDate(),
                  month: timestamp.getMonth(),
                  time: timestamp / 1000
              })
          }
          return dates;
      }
      
      function calculateStartTimestamp(dateTimestamp, day) {
          if (day === 0) {
              return dateTimestamp / 1000 - 86400 * 6;
          } else {
              return dateTimestamp / 1000 - 86400 * (day - 1);
          }
      }
      
      function setLessonStatus(lessons, throttleHours, minutesLimit) {
          // 128 已满额
          // 64 已签到
          // 32 正在上课
          // 16 准备开课
          // 8 预约
          // 4 签到
          // 2 取消预约
          // 1 已完成
          const now = new Date();
          const currentSeconds = getCurrentSeconds(now);
          now.setHours(0, 0, 0, 0);
          const todayTimestamp = now.getTime() / 1000;
          for (let i = 0; i < lessons.length; i++) {
              // if (i === 1) {
              //   const nn = new Date();
              //   nn.setHours(0, 0, 0, 0);
              //   lessons[i].dateTime = nn.getTime() / 1000;
              //   lessons[i].startTime = parseDuration("14:00")
              //   lessons[i].endTime = lessons[i].startTime + 3600
              //   lessons[i].peoples = 6;
              //   lessons[i].reservationId = 1;
              // }
              if (checkIfLessonExpired(todayTimestamp, lessons[i], currentSeconds)) {
                  continue;
              }
              if (checkIfLessonFullyBooked(todayTimestamp, lessons[i], currentSeconds, minutesLimit)) {
                  continue;
              }
              if (checkIfBooked(todayTimestamp, lessons[i], currentSeconds, minutesLimit, throttleHours)) {
                  continue;
              }
              if (todayTimestamp === lessons[i].date_time) {
                  if (lessons[i].start_time > currentSeconds && lessons[i].start_time - currentSeconds < minutesLimit * 60) {
                      lessons[i].mode = 16;
                      continue;
                  }
                  if (currentSeconds >= lessons[i].start_time && currentSeconds <= lessons[i].end_time) {
                      lessons[i].mode = 32;
                      continue;
                  }
              }
              lessons[i].mode |= 8;
          }
      }
      
      function getCurrentSeconds(now) {
          return now.getHours() * 60 * 60 + now.getMinutes() * 60;
      }
      
      function checkIfLessonExpired(todayTimestamp, lesson, currentSeconds) {
      
          // First check if it is a class before today
          // If it's today's class, check if the current time exceeds the class end time
          if (todayTimestamp > lesson.date_time ||
              (todayTimestamp === lesson.date_time && lesson.end_time <= currentSeconds)) {
              lesson.mode = 1;
              return true;
          }
          return false;
      }
      
      function checkIfLessonFullyBooked(todayTimestamp, lesson, currentSeconds, minutesLimit) {
          if (lesson.count >= lesson.peoples || lesson.peoples < 0) {
              lesson.mode = 128;
              if (todayTimestamp === lesson.dateTime) {
                  if (lesson.startTime > currentSeconds &&
                      lesson.startTime - currentSeconds < minutesLimit * 60) {
                      lesson.mode = 16;
                  } else if (currentSeconds >= lesson.startTime && currentSeconds <= lesson.endTime) {
                      lesson.mode = 32;
                  }
                  // if (today && lesson.reservedId && lesson.fulfill !== 1) {
                  //   lesson.mode |= 4;
                  // }
              }
              return true;
          }
          return false;
      }
      
      function checkIfBooked(todayTimestamp, lesson, currentSeconds, minutesLimit, throttleHours) {
          if (lesson.reservation_id) {
              if (todayTimestamp < lesson.date_time) {
                  lesson.mode = 2
                  return true;
              }
              if (lesson.start_time - currentSeconds > throttleHours * 60) {
                  lesson.mode = 2
              }
              if (lesson.fulfill === 1) {
                  lesson.mode |= 64;
              } else {
                  lesson.mode |= 4;
              }
              if (lesson.start_time > currentSeconds && lesson.start_time - currentSeconds < minutesLimit * 60) {
                  lesson.mode |= 16;
              }
              if (currentSeconds >= lesson.start_time && currentSeconds <= lesson.end_time) {
                  lesson.mode |= 32;
              }
              return true;
          }
          return false;
      }
      
      fetch(`/api/accessRecords?path=${encodeURIComponent(window.location.pathname)}&query=${encodeURIComponent(window.location.search)}`, {method: 'HEAD'});
*/

let baseUri = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '';

// http://localhost:9000
let userId = new URL(window.location).searchParams.get('userId') || getCookie("UserId");

let id = new URL(window.location).searchParams.get('id');
let items = document.getElementById('items');
const empty = document.getElementById('empty');
let startTime = new Date().setHours(0, 0, 0, 0) / 1000;
let offset = 7;

render();

const customWeekTab = document.querySelector('custom-week-tab');
const select = new Date().getDay() - 1;
customWeekTab.setAttribute('select', select === -1 ? 6 : select)
customWeekTab.addEventListener('touch', async evt => {
    const now = new Date();
    now.setDate(now.getDate() + evt.detail + offset - (select === -1 ? 6 : select));
    startTime = now.setHours(0, 0, 0, 0) / 1000;
    await render()
});

const customSwitcher = document.querySelector('custom-switcher');
customSwitcher.addEventListener('touch', async evt => {
    customWeekTab.setAttribute('select', 0);
    if (evt.detail === 0) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000;
        offset = 0;
        await render();

    } else {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        startTime = now.setHours(0, 0, 0, 0) / 1000;
        offset = 7;
        await render()
    }
});

//------------------------------------------------------


async function executeBooking(evt) {
    if (evt.detail.mode === 1) {
        if (evt.detail.mode === 1) {
            try {
                const res = await booking(evt.detail.course_id, userId);
                const resultCode = parseInt(res);
                if (resultCode < 0) {

                    if (resultCode == -101)
                        throw new Error('请购买会员卡');
                    else if (resultCode == -102 || resultCode == -104)
                        throw new Error('课程已过期');
                    else
                        throw new Error('无法预约');
                }
                render(startTime);
            } catch (e) {
                document.getElementById('toast').setAttribute('message', e.message);
            }
        }
    }
}

function executeUnBooking(evt) {
    if (evt.detail.mode === 2) {
        const customDialog = document.createElement('custom-dialog');
        const div = document.createElement('div');
        div.textContent = '您确定要取消预约吗？'
        customDialog.appendChild(div);
        customDialog.addEventListener('submit', async ev => {
            try {
                await unBooking(evt.detail.reservation_id);
                render(startTime);
            } catch (e) {
                document.getElementById('toast').setAttribute('message', '无法预约');
            }
        })
        document.body.appendChild(customDialog);

    }
}

async function loadData(startTime) {
    const response = await fetch(`${baseUri}/api/reservation.query.today?userId=${userId}&startTime=${startTime || 0}&classType=4`);
    return response.json();
}

async function render() {
    items.innerHTML = '';
    try {
        const obj = await loadData(startTime);
        empty.style.display = 'none';
        const g = groupByKey(obj, 'date_time');
        for (const key in g) {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                const customItem = document.createElement('custom-item');
                customItem.setAttribute('data', JSON.stringify(x));
                customItem.addEventListener('touch', async evt => {
                    await executeBooking(evt);
                    await executeUnBooking(evt);
                })
                customItemHeader.appendChild(customItem);
            });
            items.insertAdjacentElement('afterbegin', customItemHeader);
        }
    } catch (e) {
        empty.style.display = 'flex';
    }
}


