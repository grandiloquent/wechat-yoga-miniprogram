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
class CustomHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomHeader.template();

        this.navItems = this.root.querySelector('.nav-items');
        this.insertItem("/index", "首页", "M12 3c0 0-6.186 5.34-9.643 8.232-0.203 0.184-0.357 0.452-0.357 0.768 0 0.553 0.447 1 1 1h2v7c0 0.553 0.447 1 1 1h3c0.553 0 1-0.448 1-1v-4h4v4c0 0.552 0.447 1 1 1h3c0.553 0 1-0.447 1-1v-7h2c0.553 0 1-0.447 1-1 0-0.316-0.154-0.584-0.383-0.768-3.433-2.892-9.617-8.232-9.617-8.232z");
        this.insertDivider();
        this.insertItem();
        this.insertItem("/admin.users", "会员", "M9 12.984q1.5 0 3.281 0.422t3.258 1.406 1.477 2.203v3h-16.031v-3q0-1.219 1.477-2.203t3.258-1.406 3.281-0.422zM15 12q-0.609 0-1.313-0.234 1.313-1.547 1.313-3.75 0-0.891-0.375-2.016t-0.938-1.781q0.703-0.234 1.313-0.234 1.641 0 2.813 1.195t1.172 2.836-1.172 2.813-2.813 1.172zM5.016 8.016q0-1.641 1.172-2.836t2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172-2.813-1.172-1.172-2.813zM16.688 13.125q2.484 0.375 4.406 1.383t1.922 2.508v3h-4.031v-3q0-2.297-2.297-3.891z");
        this.insertItem("/admin.notices", "公告", "M14.016 3.234q3.047 0.656 5.016 3.117t1.969 5.648-1.969 5.648-5.016 3.117v-2.063q2.203-0.656 3.586-2.484t1.383-4.219-1.383-4.219-3.586-2.484v-2.063zM16.5 12q0 2.813-2.484 4.031v-8.063q1.031 0.516 1.758 1.688t0.727 2.344zM3 9h3.984l5.016-5.016v16.031l-5.016-5.016h-3.984v-6z");
        this.insertDivider();
        this.insertItem("/admin.help", "帮助", "M15.047 11.25q0.938-0.938 0.938-2.25 0-1.641-1.172-2.813t-2.813-1.172-2.813 1.172-1.172 2.813h1.969q0-0.797 0.609-1.406t1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406l-1.219 1.266q-1.172 1.266-1.172 2.813v0.516h1.969q0-1.547 1.172-2.813zM12.984 18.984v-1.969h-1.969v1.969h1.969zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z");

    }


    static get observedAttributes() {
        return ['title'];
    }

    insertDivider() {
        const div = document.createElement('div');
        div.style.background = "#dadce0";
        div.style.height = "1px";
        div.style.margin = "5px 0";
        this.navItems.appendChild(div);
    }

    insertItem(href, title, d) {
        const navItem = document.createElement('a');
        navItem.setAttribute("class", "nav-item");
        navItem.setAttribute("href", href || "/admin.lessons");
        const img = document.createElement('div');
        img.setAttribute("class", "img");
        navItem.appendChild(img);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewbox", "0 0 24 24");
        img.appendChild(svg);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", d || "M12 8.016q-1.219 0-2.109-0.891t-0.891-2.109 0.891-2.109 2.109-0.891 2.109 0.891 0.891 2.109-0.891 2.109-2.109 0.891zM12 11.531q3.75-3.516 9-3.516v10.969q-5.203 0-9 3.563-3.797-3.563-9-3.563v-10.969q5.25 0 9 3.516z");
        svg.appendChild(path);
        navItem.appendChild(document.createTextNode(title || `课程`));
        this.navItems.appendChild(navItem);
    }

    connectedCallback() {
        const navItems = this.root.querySelector('.nav-items');
        const container = this.root.querySelector('.container');
        container.addEventListener('click', evt => {
            evt.stopPropagation();
            requestAnimationFrame(() => {
                navItems.style.transform = 'translateX(0)';
                setTimeout(() => {
                    container.style.display = 'none';
                    container.style.background = 'rgba(0,0,0,0)';
                }, 250)
            })
        });
        this.root.querySelector('.nav').addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('nav'));
            container.style.background = 'rgba(0,0,0,.6)';
            container.style.display = 'block';
            requestAnimationFrame(() => {
                navItems.style.transform = 'translateX(250px)';
            })
        })
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'title') {
            this.root.querySelector('.header').textContent = newVal;
        }
    }

    static template() {
        return `
        ${CustomHeader.style()}

    <div class="header">
    </div>
    <div class="nav">
      <div class="nav-wrapper">
        <svg style="fill: #70757a; width: 24px; height: 24px;" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none">
          </path>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z">
          </path>
        </svg>
      </div>
      <div class="container">
        <div class="nav-items">
          

        </div>
      </div>
    </div>
  
   `;
    }

    static style() {
        return `
        <style>
.header
{
    display: flex;
    height: 64px;
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
}
.nav
{
    position: absolute;
    top: 0;
}
.nav-wrapper
{
    padding: 18px;
}
.container
{
    background-color: rgba(0,0,0,0);
    display: none;
    height: 100%;
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 199;


}
.nav-items
{
    background-color: #fff;
    height: 100%;
    font-size: 16px;
    left: -250px;
    outline: none;
    overflow-y: scroll;
    padding-top: 15px;
    position: fixed;
    top: 0;
    transition: .5s;
    width: 250px;
    z-index: 200;
}
.nav-item
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
.nav-item > .img
{
    padding: 0 15px;
    /*margin-bottom: 3px;*/
    width: 24px;
    /*vertical-align: middle;*/
  display: flex;
  align-items: center;
}
svg{
width: 24px;
height: 24px;
fill: currentColor;
}
        </style>`;
    }


}

customElements.define('custom-header', CustomHeader);
/*
<!--
<script src="index.js"></script>
<custom-index></custom-index>
-->
 */

class CustomActions extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.wrapper {
            user-select: none;
}
.item-container {
    position: relative;
    display: flex;
    height: 100%;
    max-width: 100%;
    overflow-y: hidden;
    overflow-x: overlay;
    padding-left: 16px;
}
.item-container::-webkit-scrollbar {
    display: none;
}
.item.active {
    border: 1px solid transparent;
    background: #e8f0fe;
    color: #1967d2;
}
.item {
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.25rem;
    border-radius: 24px;
    box-sizing: border-box;
    border: 1px solid #dadce0;
    color: #3c4043;
    padding: 5px 13px;
    margin-right: 8px;
}`;
        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        this.root.appendChild(wrapper);
        const itemContainer = document.createElement('div');
        itemContainer.setAttribute("class", "item-container");
        wrapper.appendChild(itemContainer);
        this.itemContainer = itemContainer;
    }
    static get observedAttributes() {
        return ['items'];
    }
    connectedCallback() {
        // 
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'items') {
            const items = [];
            JSON.parse(newVal).forEach((x, k) => {
                const itemActive = document.createElement('div');
                if (k === 0)
                    itemActive.setAttribute("class", "item active");
                else
                    itemActive.setAttribute("class", "item");
                itemActive.textContent = x;
                this.itemContainer.appendChild(itemActive);
                items.push(itemActive);
            });
            items.forEach((x, k) => {
                x.addEventListener('click', evt => {
                    items.forEach(x => {
                        if (x === evt.currentTarget) {
                            x.classList.add('active');
                        }
                        else {
                            x.classList.remove('active');
                        }
                    });
                    this.dispatchEvent(new CustomEvent('touch', {
                        detail: k
                    }));
                })
            })
        }
    }
}
customElements.define('custom-actions', CustomActions);
/*
<!--
<script src="actions.js"></script>
<custom-actions></custom-actions>
const customCustomActions = document.querySelector('custom-actions');
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
let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
let list = document.getElementById('list');
let startTime = new Date().setHours(0, 0, 0, 0) / 1000;
let endTime = startTime + 86400;
const customActions = document.querySelector('custom-actions');
customActions.setAttribute('items', JSON.stringify(["今天", "明天", "本周","下周"]));

customActions.addEventListener('touch', evt => {
    if (evt.detail === 0) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 1 * 3600 * 24;
    } else if (evt.detail === 1) {
        startTime = endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 1 * 3600 * 24;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 2 * 3600 * 24;
    } else if (evt.detail === 2) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 7 * 3600 * 24;
    }else if (evt.detail === 3) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000 + 7 * 3600 * 24;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 14 * 3600 * 24;
    }
    render();
});
async function loadData() {

    const classType = 4;
    const response = await fetch(`${baseUri}/api/reservation.query.booked?startTime=${startTime}&endTime=${endTime}&classType=${classType}`);
    return response.json();
}

async function render() {
    list.innerHTML = '';
    try {
        const obj = await loadData();
        const g = groupByKey(obj, 'date_time');
        Object.keys(g).sort().reverse().forEach(key => {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                console.log(x);
                const div = document.createElement('div');
                
                div.innerHTML = `<div style="user-select: none;border-top: 1px solid #e8eaed; padding:12px 16px;position:relative ">
                <a style="position:absolute;left:0;top:0;right:0;bottom:0" href="/admin.booking?id=${x.course_id}"></a>
                <div style="display: flex;"><img style="width: 92px; height: 92px; margin-right: 16px; border-radius: 8px;"
                        src="https://static.lucidu.cn/images/${x.thumbnail}">
                    <div style="flex-grow: 1;">
                        <div style="color: #5f6368; font-size: 12px; line-height: 16px; display: flex; align-items: center;">
                            <div>${secondsToDuration(x.start_time)}-${secondsToDuration(x.end_time)}</div>
                        </div><a style="color: #202124; font-size: 16px; line-height: 24px; padding-top: 8px;text-decoration: none;"
                            >${x.lesson_name}</a>
                    </div>
                </div>
                <div style="display:flex;padding:8px 0 0 0">
                    <div style="flex-grow:1"></div>
                    <div style="color:rgb(112, 117, 122);font-size:12px;line-height:16px">已预约 ${x.total}/${x.peoples} 人</div>
                </div>
            </div>`;
                customItemHeader.appendChild(div);
                
            });
            list.insertAdjacentElement('afterbegin', customItemHeader);
        })

    } catch (error) {
        console.log(error)
        document.getElementById('toast').setAttribute('message', error);
    }
}

render();

