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
class CustomExpandable extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});

        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `
        .wrapper
        {
            /*margin-bottom: 24px;*/
            display: flex;
            flex-direction: column;
            user-select: none;
        }
        .container
        {
            min-width: 296px;
            width: 100%;
            /*margin: 0 -16px 8px;*/
            padding: 0 16px;
            border-bottom: 8px solid #f1f3f4;
            box-sizing: border-box;
        }
        .inner
        {
            cursor: pointer;
            display: flex;
            outline: none;
            transition: background .2s .1s;
            -webkit-box-align: center;
            align-items: center;
            padding: 0;
                        
        }
        .content
        {
            -webkit-box-flex: 1;
            flex-grow: 1;
            flex-shrink: 1;
        }
        .button
        {
            color: rgba(0,0,0,.65);
            -webkit-box-flex: 0;
            flex-grow: 0;
            flex-shrink: 0;
            padding-left: 16px;
            width: 24px;
            position: relative;
            -webkit-user-select: none;
            margin: 0;
            display: flex;
        }
        .button>svg
        {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }
        .title
        {
            font-family: "Google Sans",Roboto,Arial,sans-serif;
            font-size: 1.125rem;
            font-weight: 400;
            letter-spacing: 0;
            line-height: 1.5rem;
            -webkit-box-align: center;
            align-items: center;
            margin-bottom: 0;
            margin-top: 0;
        }
        .subtitle
        {
            letter-spacing: .01428571em;
            font-family: Roboto,Arial,sans-serif;
            font-size: .875rem;
            font-weight: 400;
            line-height: 1.25rem;
            color: #5f6368;
            margin-top: 0;
            margin-bottom: 16px;
        }
        `;
        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        this.root.appendChild(wrapper);
        const container = document.createElement('div');
        container.setAttribute("class", "container");
        wrapper.appendChild(container);
        const inner = document.createElement('div');
        inner.setAttribute("class", "inner");
        container.appendChild(inner);
        const content = document.createElement('div');
        content.setAttribute("class", "content");
        inner.appendChild(content);
        const title = document.createElement('div');
        title.setAttribute("class", "title");
        content.appendChild(title);
        title.textContent = `周一`;
        const subtitle = document.createElement('div');
        subtitle.setAttribute("class", "subtitle");
        content.appendChild(subtitle);
        subtitle.textContent = `周一`;
        const button = document.createElement('div');
        button.setAttribute("class", "button");
        inner.appendChild(button);
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute("viewbox", "0 0 24 24");
        button.appendChild(svg);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute("d", "M7.406 8.578l4.594 4.594 4.594-4.594 1.406 1.406-6 6-6-6z");
        svg.appendChild(path);
        const slot = document.createElement('slot');
        container.appendChild(slot);

        this.titleRender = title;
        this.subtitleRender = subtitle;
        this.button = button;
        this.svg = svg;
        this.inner = inner;
    }


    static get observedAttributes() {
        return ['title', 'subtitle'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        this.addEventListener('click', evt => {
            if (this.svg.dataset.expand === '1') {
                this.svg.dataset.expand = '0'
                this.svg.style = 'transition: transform .3s ease-in-out; transform: rotate(0deg)';
                this.inner.style.borderBottom = 'none';
            } else {
                this.svg.dataset.expand = '1'
                this.svg.style = 'transition: transform .3s ease-in-out; transform: rotate(180deg)';
                this.inner.style.borderBottom = '1px solid #e8eaed';
            }
            this.dispatchEvent(new CustomEvent('expand', {
                detail: this.svg.dataset.expand
            }));
        })
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'title') {
            this.titleRender.textContent = newVal;
        } else if (attrName === 'subtitle') {
            this.subtitleRender.textContent = newVal;
        }
    }

}

customElements.define('custom-expandable', CustomExpandable);
/*
<!--
<script src="expandable.js"></script>
<custom-expandable></custom-expandable>
const customCustomExpandable = document.querySelector('custom-expandable');
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
let baseUri = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '';

let startTime = new Date().setHours(0, 0, 0, 0) / 1000;
let endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 1 * 3600 * 24;
let userId = new URL(window.location).searchParams.get('userId') || getCookie('UserId');
let list = document.getElementById('list');
let expandable = document.getElementById('expandable');

const leftText = document.querySelector('#left .text');
const weeks = '日一二三四五六'.split('');


initialize();


const customActions = document.querySelector('custom-actions');
customActions.setAttribute('items', JSON.stringify(["今天", "明天", "一周内"]));

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
    }
    render();
});

const customExpandable = document.querySelector('custom-expandable');

let height = 0;
expandable.style.height = 0;

const items = [...document.querySelectorAll('.item')]

customExpandable.addEventListener('expand', evt => {
    if (evt.detail === '0') {
        expandable.style.height = 0;
        items.forEach(x => x.style.visibility = 'hidden')
    } else {
        items.forEach(x => x.style.visibility = 'visible')
        expandable.style.height = `${height}px`;

    }
})

render();

//------------------------------------------------------

async function loadData(startTime, endTime, userId) {
    const response = await fetch(`${baseUri}/api/reservation.query.user?startTime=${startTime}&endTime=${endTime}&userId=${userId}&classType=4`);
    return response.json();
}

async function render() {
    list.innerHTML = '';
    try {
        const obj = await loadData(startTime, endTime, userId);
        const g = groupByKey(obj, 'date_time');
        Object.keys(g).sort().reverse().forEach(key => {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                const customItem = document.createElement('custom-item');
                customItem.setAttribute('data', JSON.stringify(x));
                customItem.addEventListener('touch', async evt => {

                    await executeUnBooking(customItem, evt);
                })
                customItemHeader.appendChild(customItem);
            });
            list.insertAdjacentElement('afterbegin', customItemHeader);
        })

    } catch (error) {
        const customEmptyViewer = document.createElement('custom-empty-viewer');
        customEmptyViewer.setAttribute('text', '未找到相关课程');
        customEmptyViewer.setAttribute('label', '预约课程');
        customEmptyViewer.addEventListener('submit',evt=>{
            window.location='/appointment';
        })
        list.appendChild(customEmptyViewer);
      
    }
}

function initialize() {
    const now = new Date();
    leftText.textContent = `${now.getMonth() + 1}月${now.getDate()}日周${weeks[now.getDay()]}`;
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
                if (element.parentNode.querySelectorAll('custom-item').length > 1) {
                    element.remove();
                } else {
                    element.parentNode.remove();
                }
            } catch (e) {
                document.getElementById('toast').setAttribute('message', '无法预约');
            }
        })
        document.body.appendChild(customDialog);

    }
}
