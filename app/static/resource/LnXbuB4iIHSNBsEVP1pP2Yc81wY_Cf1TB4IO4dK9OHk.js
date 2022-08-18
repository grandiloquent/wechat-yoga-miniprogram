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
class CustomPicker extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `
<style>
.{

}.picker__frame
{
    position: absolute;
    top: 50%;
    right:0;
    left: 0;
    z-index: 2;
    transform: translateY(-50%);
    pointer-events: none;
    border:1px  solid #ebedf0;
    border-left:0;
    border-right:0
}
.picker__mask
{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg,hsla(0,0%,100%,.9),hsla(0,0%,100%,.4)),linear-gradient(0deg,hsla(0,0%,100%,.9),hsla(0,0%,100%,.4));
    background-repeat: no-repeat;
    background-position: top,bottom;
    transform: translateZ(0);
    pointer-events: none;
    background-size: 100% 62px;
}
.picker-column__item
{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 0 4px;
    color: #000;
}
.picker-column__wrapper
{
    transition-timing-function: cubic-bezier(.23,1,.68,1);
    transition-duration: 200ms;
    transition-property: none;
    transform :translate3d(0px, 48px, 0px);
    transform-origin: 0 0;
}
.picker-column
{
    -webkit-box-flex: 1;
    flex: 1;
    overflow: hidden;
    font-size: 16px;
}
.picker__columns
{
    position: relative;
    display: flex;
    cursor: grab;
     
}</style>
    <div class="picker__columns">
      <div class="picker-column">
        <div class="picker-column__wrapper">
          
        </div>
        <div class="picker__mask">
        </div>
        <div class="picker__frame">
        </div>
      </div>
    </div>
		`;
    }


    static get observedAttributes() {
        return ['mode', 'start', 'month'];
    }
    get mode() {
        return this.getAttribute('mode')
    }
    get start() {
        return this.getAttribute('start')
    }
    get month() {
        return this.getAttribute('month')
    }
    connectedCallback() {
        this.offset = 0;
        if (this.mode === '1') {
            this.count = 10;
        } else if (this.mode === '2') {
            this.count = 12;
        } else if (this.mode === '3') {
            const month = parseInt(this.month);
            this.count = new Date(new Date().getFullYear(), month - 1, 0).getDate();
        }
        this.min = -1;
        this.max = this.min + this.count - 1;
        this.root.host.style.userSelect = 'none';
        this.pickerColumnWrapper = this.root.querySelector('.picker-column__wrapper');
        this.pickerColumns = this.root.querySelector('.picker__columns');
        this.pickerColumns.addEventListener('touchstart', event => {
            event.stopPropagation();
            this.startY = event.touches[0].clientY;
            this.startOffset = this.offset;
            // duration: 0,
        });
        this.pickerColumns.addEventListener('touchmove', event => {
            event.stopPropagation();
            const deltaY = event.touches[0].clientY - this.startY;
            this.offset = range(
                this.startOffset + deltaY,
                -(this.count * this.itemHeight),
                (this.count * this.itemHeight)
            );
            this.pickerColumnWrapper.style.transform = `translate3d(0px, ${this.offset}px, 0px)`
        });
        this.pickerColumns.addEventListener('touchend', event => {
            event.stopPropagation();
            const index = Math.round(-this.offset / this.itemHeight);
            this.setIndex(index, true);
        });
        const items = [];
        const y = new Date().getFullYear();
        for (let i = 0; i < this.count; i++) {
            const pickerColumnItem = document.createElement('div');
            pickerColumnItem.setAttribute("class", "picker-column__item");
            if (this.mode === '1')
                pickerColumnItem.textContent = `${y + i}年`;
            else if (this.mode === '2')
                pickerColumnItem.textContent = `${i + 1}月`;
            else if (this.mode === '3')
                pickerColumnItem.textContent = `${i + 1}日`;
            pickerColumnItem.style.height = '48px';
            pickerColumnItem.style.color = '#000'
            this.pickerColumnWrapper.appendChild(pickerColumnItem);
            items.push(pickerColumnItem);
        }
        this.pickerFrame = this.root.querySelector('.picker__frame');
        this.pickerFrame.addEventListener('click', evt => {

        })
        this.itemHeight = items[0].getBoundingClientRect().height;

        this.pickerColumns.style.height = `${this.itemHeight * 3}px`; //(this.itemHeight * (this.count +(this.count % 2 === 0 ? 1 : 0))) + 'px';

        this.pickerFrame.style.height = `${this.itemHeight}px`;
        if (this.mode === '1') {
            if (this.start) {
                this.setIndex(parseInt(this.start)-((new Date()).getFullYear()) - 1);
            } else {
                this.setIndex(- 1);
            }
        }
        else if (this.mode === '2') {
            if (this.start) {
                this.setIndex(parseInt(this.start) - 2);
            } else {
                this.setIndex(new Date().getMonth() - 1);
            }
        }
        else if (this.mode === '3') {
            if (this.start) {
                this.setIndex(parseInt(this.start) - 2);
            } else {
                this.setIndex(new Date().getDate() - 2)
            }

        }

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
    }
    get value() {

        if (this.mode === '1')
            return new Date().getFullYear() + this.currentIndex + 1;
        else if (this.mode === '2')
            return this.currentIndex + 2;
        else if (this.mode === '3')
            return this.currentIndex + 2;
    }
    adjustIndex(index) {
        const count = this.count;

        index = range(index, this.min, this.max);
        // for (let i = index; i < count; i++) {
        //     return i;
        // }
        // for (let i = index - 1; i >= 0; i--) {
        //     return i;
        // }
        return index;
    }
    setIndex(index) {
        // const { data } = this;
        index = this.adjustIndex(index) || 0;

        this.offset = -index * this.itemHeight;
        if (index !== this.currentIndex) {
            this.currentIndex = index;

        }

        this.pickerColumnWrapper.style.transform = `translate3d(0px, ${this.offset}px, 0px)`
    }
    disconnectedCallback() {

    }
    getCount() {
        return 5;
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'start') {
            if (this.mode === '1') {
                this.setIndex(parseInt(newVal)-((new Date()).getFullYear()) - 1);
            }
            else if (this.mode === '2') {
                this.setIndex(parseInt(newVal) - 2);
            }
            else if (this.mode === '3') {
                this.setIndex(parseInt(newVal) - 2);
            }
        }
    }

}
customElements.define('custom-picker', CustomPicker);
/*
<!--\
<custom-picker></custom-picker>
<script src="components/picker.js"></script>
const customPicker = document.querySelector('custom-picker');
const customPicker = document.createElement('custom-picker');
customPicker.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customPicker);
-->
*/
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

class CustomOptions extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
        .active{
            background:#e8f0fe!important;
            color:#1967d2!important;
        }
        .container
        {
            padding: 0 24px;
            font-size: 14px;
            line-height: 20px;
            margin: 24px 0 12px;
        }
        .grid
        {
            display: grid;
            grid-template-columns: repeat(2,1fr);
            gap: 1px;
            background-color: #dadce0;
            border: 1px solid #dadce0;
            border-radius: 8px;
            overflow: hidden;
        }
        .item
        {
            background: #fff;
        }
        .item-wrapper
        {
            padding: 12px 8px 8px;
            text-align: center;
        }</style>
            <div class="container">
              <div class="grid">
              </div>
            </div>
		`;
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        this.grid = this.root.querySelector('.grid');


    }
    populateData(obj, selected) {
        obj.forEach((x, k) => {
            const item = `<div data-value="${x}" class="item">
        <div class="item-wrapper">
            <div>${x}</div>
        </div>
    </div>`;
            this.grid.insertAdjacentHTML('afterbegin', item);
        })
        this.items = this.root.querySelectorAll('.item');

        this.items.forEach(item => {
            item.addEventListener('click', evt => {
                const element = evt.currentTarget;
                this.items.forEach(v => {
                    if (element !== v) {
                        v.classList.remove('active');
                    } else
                        element.classList.add('active');
                });
                this.dispatchEvent(new CustomEvent('submit', {
                    detail: element.dataset.value
                }));
            })
        })
        
        this.items.forEach(v => {
            if (v.dataset.value === selected) {
                v.classList.add('active');
                return;
            }
        });
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
        }
    }

}
customElements.define('custom-options', CustomOptions);
/*
<!--\
<custom-options></custom-options>
<script src="components/options.js"></script>
const customOptions = document.querySelector('custom-options');
const customOptions = document.createElement('custom-options');
customOptions.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customOptions);
-->
*/
class CustomSelect extends HTMLElement {

  constructor() {
    super();

    this.root = this.attachShadow({ mode: 'open' });

  }


  static get observedAttributes() {
    return ['title'];
  }


  connectedCallback() {

    this.root.host.style.userSelect = 'none';
    this.root.innerHTML = `
    <style>.content-wrapper
    {
        -webkit-box-flex: 1;
        flex: 1;
        overflow-y: auto;
        padding-bottom: 12px;
    }
    .button
    {
        user-select: none;
        border: none;
        outline: none;
        font: inherit;
        text-transform: inherit;
        color: inherit;
        background: transparent;
        cursor: pointer;
        padding: 12px;
        margin: -12px 0;
        display: flex;
        algin-items: center;
    }
    .list-header-button
    {
        font-family: Roboto,Arial,sans-serif;
        word-wrap: break-word;
        -webkit-text-size-adjust: 100%;
        -webkit-box-direction: normal;
        display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        box-sizing: border-box;
        user-select: none;
        font-size: 1.4rem;
        text-transform: uppercase;
        border-radius: 3px;
        position: relative;
        min-width: 0;
        margin: 0;
        flex-shrink: 0;
        color: #606060;
    }
    .list-header-title
    {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        max-height: 2.5em;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: .01em;
        -webkit-box-flex: 1;
        flex-grow: 1;
        margin: 0;
        font-weight: 700;
        font-size: 18px;
        line-height: 18px;
    }
    .list-header
    {
        font-family: Roboto,Arial,sans-serif;
        word-wrap: break-word;
        color: #030303;
        -webkit-text-size-adjust: 100%;
        font-size: 1.2rem;
        -webkit-box-direction: normal;
        display: flex;
        flex-shrink: 0;
        -webkit-box-align: center;
        align-items: center;
        border-bottom: 1px solid rgba(0,0,0,.1);
        z-index: 3;
        position: sticky;
        top: 0;
        padding: 12px 12px;
    }
    .list-header-wrapper
    {
        font-family: Roboto,Arial,sans-serif;
        word-wrap: break-word;
        color: #030303;
        -webkit-text-size-adjust: 100%;
        font-size: 1.2rem;
        -webkit-box-direction: normal;
        z-index: 1;
        padding-top: 8px;
    }
    .panel-drag-line
    {
        background: #030303;
        opacity: .15;
        border-radius: 4px;
        height: 4px;
        margin: 0 auto;
        width: 40px;
    }
    .panel-container
    {
        background-color: #f9f9f9;
        -webkit-box-flex: 1;
        flex-grow: 1;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
        transform: translateY(0);
    }
    .list-background
    {
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        -webkit-box-flex: 1;
        flex-grow: 1;
        height: 100%;
        background: #000;
    }
    .list-renderer
    {
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }
    .panel
    {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        top: calc(56.25vw + 48px);
        z-index: 4;
    }
    .c3-overlay
    {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        cursor: pointer;
        background-color: rgba(0,0,0,.8);
    }</style>
        <div class="panel">
          <div class="list-renderer">
            <div class="list-background">
              <div class="panel-container">
                <div class="list-header-wrapper">
                  <div class="panel-drag-line">
                  </div>
                  <div class="list-header">
                    <div class="list-header-title">
                      说明
                    </div>
                    <div class="list-header-button">
                      <div class="button">
                        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M12.71,12l8.15,8.15l-0.71,0.71L12,12.71l-8.15,8.15l-0.71-0.71L11.29,12L3.15,3.85l0.71-0.71L12,11.29l8.15-8.15l0.71,0.71 L12.71,12z">
                          </path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="content-wrapper">
                  <slot>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="c3-overlay">
        </div>
		`;
    // this.dispatchEvent(new CustomEvent());
    /*
    this.dispatchEvent(new CustomEvent('touch', {
              detail: 0
          }));
          */
    this.button = this.root.querySelector('.button');
    this.button.addEventListener('click', evt => {
      this.remove();
    })
    this.listHeaderTitle = this.root.querySelector('.list-header-title');

    this.c3Overlay = this.root.querySelector('.c3-overlay');
    this.c3Overlay.addEventListener('click', evt => {
      this.remove();
    })
    if (this.titleString) {
      this.listHeaderTitle.textContent = this.titleString;
    }
  }
  disconnectedCallback() {

  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (attrName === 'title') {
      if (this.listHeaderTitle)
        this.listHeaderTitle.textContent = newVal;
      else
        this.titleString = newVal;
    }
  }

}
customElements.define('custom-select', CustomSelect);
/*
<!--\
<custom-select></custom-select>
<script src="components/select.js"></script>
const customSelect = document.querySelector('custom-select');
const customSelect = document.createElement('custom-select');
customSelect.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customSelect);
-->
*/
class CustomSubmitBar extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `<style>.shadow
        {
            border-width: 0;
            box-shadow: 0 1px 2px 0 rgba(60,64,67,.3),0 2px 6px 2px rgba(60,64,67,.15);
            height: 2px;
            left: 0;
            pointer-events: none;
            position: fixed;
            right: 0;
            transition: opacity .15s 0ms cubic-bezier(.4,0,.2,1);
            bottom: 68px;
            opacity: 1;
            z-index: 0;
        }
        .submit
        {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-width: 64px;
            font-size: 14px;
            letter-spacing: .15px;
            font-weight: 500;
            text-transform: none;
            height: 32px;
            padding: 0 24px 0 24px;
            border-radius: 16px;
            margin: 8px 0 8px 8px;
            background-color: #1a73e8;
            color: #fff;
        }
        .close
        {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            min-width: 64px;
            font-size: 14px;
            letter-spacing: .15px;
            font-weight: 500;
            text-transform: none;
            height: 32px;
            padding: 0 24px 0 24px;
            border-radius: 16px;
            margin-top: 8px;
            margin-bottom: 8px;
        }
        .right
        {
            text-size-adjust: 100%;
            -webkit-font-smoothing: auto;
            font: 400 14px/20px Roboto,Arial,sans-serif;
            letter-spacing: .2px;
            color: #70757a;
            -webkit-tap-highlight-color: transparent;
            display: flex;
        }
        .left
        {
            flex: 1 1 auto;
        }
        .wrapper
        {
            align-items: center;
            height: 68px;
            padding: 0 16px;
            display: flex;
            flex: 0 0 auto;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            background: #fff;
        }</style>
            <div class="shadow">
            </div>
            <div class="wrapper">
              <div class="left">
              </div>
              <div class="right">
                <div class="close">
                  取消
                </div>
                <div class="submit">
                  确认
                </div>
              </div>
            </div>
		`;
        this.close = this.root.querySelector('.close');
        this.close.addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('close'));
        })
        this.submit = this.root.querySelector('.submit');
        this.submit.addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('submit'));
        })

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
        }
    }

}
customElements.define('custom-submit-bar', CustomSubmitBar);
/*
<!--\
<custom-submit-bar></custom-submit-bar>
<script src="components/submit-bar.js"></script>
const customSubmitBar = document.querySelector('custom-submit-bar');
const customSubmitBar = document.createElement('custom-submit-bar');
customSubmitBar.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customSubmitBar);
-->
*/
class CustomCell extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ["key", "value"];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
        .cell
        {
            position: relative;
            display: flex;
            box-sizing: border-box;
            width: 100%;
            padding: 10px 16px;
            overflow: hidden;
            color: #323233;
            font-size: 14px;
            line-height: 24px;
            background: #fff;
            cursor: pointer;
            border-bottom:1px solid rgb(235, 237, 240);
        }
        .cell__right-icon
        {
            height: 24px;
            width: 16px;
            color: #969799;
            fill:currentColor;
            margin-left:4px;
        }
        .cell__value
        {
            flex: 1;
            position: relative;
            overflow: hidden;
            color: #969799;
            text-align: right;
            vertical-align: middle;
            word-wrap: break-word;
        }
        .cell__title
        {
            cursor: pointer;
            flex: 1;
        }
      svg{
        height:100%;
        width:100%;
      }
      </style>
      <div class="cell">
        <div class="cell__title">
          单元格
        </div>
        <div class="cell__value">
          单元格
        </div>
        <div class="cell__right-icon">
          <svg viewBox="0 0 24 24">
            <path d="M5.859 4.125l2.156-2.109 9.984 9.984-9.984 9.984-2.156-2.109 7.922-7.875z">
            </path>
          </svg>
        </div>
      </div>
        `;
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        this.cellTitle = this.root.querySelector('.cell__title');
        if (this.cellTitleString) {
            this.cellTitle.textContent = this.cellTitleString;
        }
        this.cellValue = this.root.querySelector('.cell__value');
        if (this.cellValueString) {
            this.cellValue.textContent = this.cellValueString;
        }
    }
    get value() {
        return this.cellValueString;
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'key') {
            this.cellTitleString = newVal;
            if (this.cellTitle)
                this.cellTitle.textContent = newVal;
        } else if (attrName === 'value') {
            this.cellValueString = newVal;
            if (this.cellValue)
                this.cellValue.textContent = newVal;
            
               
        }
    }

}
customElements.define('custom-cell', CustomCell);
/*
<!--\
<custom-cell></custom-cell>
<script src="components/cell.js"></script>
const customCell = document.querySelector('custom-cell');
const customCell = document.createElement('custom-cell');
customCell.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customCell);
-->
*/
class CustomStickyHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
      
      
        .out
        {
            top: -48px!important;
            -webkit-transition: -webkit-transform 195ms cubic-bezier(.4,0,1,1);
            transition: -webkit-transform 195ms cubic-bezier(.4,0,1,1);
            transition: transform 195ms cubic-bezier(.4,0,1,1);
            transition: transform 195ms cubic-bezier(.4,0,1,1),-webkit-transform 195ms cubic-bezier(.4,0,1,1);
            -webkit-transition-property: all;
            transition-property: all;
            box-shadow:none!important;
        }
        .in
        {
            top:0px!important;
            -webkit-transition: -webkit-transform 225ms cubic-bezier(0,0,.2,1);
            transition: -webkit-transform 225ms cubic-bezier(0,0,.2,1);
            transition: transform 225ms cubic-bezier(0,0,.2,1);
            transition: transform 225ms cubic-bezier(0,0,.2,1),-webkit-transform 225ms cubic-bezier(0,0,.2,1);
            -webkit-transition-property: all;
            transition-property: all;
        }

</style>
<div style="font-size:16px;color:rgb(3,3,3);line-height:20px;height: 48px; position: fixed; top: 0; left: 0; right: 0; padding: 0; padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left); display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 2px -2px rgba(0,0,0,.2);z-index:1">
<div id="back" style="margin-right:24px;display: inline-block; flex-shrink: 0; width: 48px; height: 48px; fill: #606060; stroke: none; padding: 12px; box-sizing: border-box;">
  <svg style="width: 24px; height: 24px;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <path d="M532.526499 904.817574L139.506311 511.797385 532.526499 118.777197c12.258185-12.258185 12.432147-32.892131-0.187265-45.51052-12.707416-12.707416-32.995485-12.703323-45.511543-0.187265L75.166957 484.739123c-7.120165 7.120165-10.163477 17.065677-8.990768 26.624381-1.500167 9.755178 1.5104 20.010753 8.990768 27.491121l411.660734 411.660734c12.258185 12.258185 32.892131 12.432147 45.511543-0.187265 12.707416-12.707416 12.7023-32.995485 0.187265-45.51052z">
    </path>
  </svg>
</div>
<div id="title" style="flex-grow: 1;">
</div>
</div>
        `;
        this.container = this.root.querySelector('div');

    }


    static get observedAttributes() {
        return ['active', 'inactive', 'title'];
    }


    connectedCallback() {
        this.root.querySelector('#back').addEventListener('click', evt => {
            window.history.back();
        })
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'active') {
            this.container.className = 'in';
        } else if (attrName === 'inactive') {
            this.container.className = 'out';
        } else {
            this.root.querySelector('#title').textContent = newVal;
        }
    }

}
customElements.define('custom-sticky-header', CustomStickyHeader);
/*
<!--\
<custom-sticky-header></custom-sticky-header>
<script src="components/sticky-header.js"></script>
const customStickyHeader = document.querySelector('custom-sticky-header');
const customStickyHeader = document.createElement('custom-sticky-header');
customStickyHeader.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customStickyHeader);
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
class CustomSearch extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomSearch.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        const closeButton = this.root.querySelector('.close-button');
        closeButton.style.display = 'none';
        closeButton.addEventListener('click', evt => {
            input.value = '';
            closeButton.style.display = 'none';
        });
        const input = this.root.querySelector('input');
        input.addEventListener('input', evt => {
            if (input.value.length) {
                closeButton.style.display = 'block';
            }
        });
        input.addEventListener('keydown', evt => {
            if (evt.key === 'Enter') {
                this.dispatchEvent(new CustomEvent('submit', {
                    detail: input.value
                }));
            }
        })

        const searchButton = this.root.querySelector('.search-button');
        searchButton.addEventListener('click', evt => {
            this.dispatchEvent(new CustomEvent('submit', {
                detail: input.value
            }));
        });
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
        ${CustomSearch.style()}

    <div class="wrapper">
      <div class="layout">
        <div class="box">
          <button class="search-button">
            <div class="search-button-wrapper">
              <span>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                  </path>
                </svg>
              </span>
            </div>
          </button>
          <div class="search-main">
            <div class="search-main-wrapper">
              <input type="text" maxlength="2048" name="q" aria-autocomplete="list" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" tabindex="0" title="搜索" aria-label="搜索" />
            </div>
          </div>
          <div class="right">
            <button class="close-button">
              <span>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z">
                  </path>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

   `;
    }

    static style() {
        return `
        <style>
.wrapper
{
    position: relative;
    overflow: visible;
    box-shadow: none;
    border-radius: 25px;
    background: none;
    margin: -1px 16px 0;
}
.layout
{
    background: none;
    border-radius: 25px;
    padding-bottom: 4px;
}
.box
{
    display: flex;
    height: 44px;
    margin-top: 0;
    z-index: 3;
    box-shadow: 0 2px 5px 0 rgba(60,64,67,.16);
    border-radius: 25px;
    background: #fff;
}
.search-button
{
    display: flex;
    border-radius: 0 25px 25px 0;
    background: transparent;
    border: none;
    margin: 0 -1px 0 0;
    padding: 0 0 0 12px;
    flex: 0 0 auto;
    outline: 0;
}
.search-button-wrapper
{
    background: none;
    color: #9aa0a6;
    height: 24px;
    width: 24px;
    margin: auto;
}
button span
{
    display: inline-block;
    fill: currentColor;
    height: 24px;
    line-height: 24px;
    position: relative;
    width: 24px;
}
.search-main
{
    flex: 1;
    display: flex;
    padding: 7px 0;
}
.search-main-wrapper
{
    display: flex;
    flex: 1;
}
input[type=text]
{
    line-height: 25px;
    background-color: transparent;
    border: none;
    margin: 0;
    padding: 0 0 0 16px;
    font-size: 16px;
    font-family: Roboto,Helvetica Neue,Arial,sans-serif;
    color: rgba(0,0,0,.87);
    word-wrap: break-word;
    display: flex;
    flex: 1;
    -webkit-tap-highlight-color: transparent;
    width: 100%;
    outline: 0;
}
.right
{
    display: flex;
    flex: 0 0 auto;
    align-items: stretch;
    margin-right: -3px;
}
.close-button
{
    display: flex;
    flex: 1;
    color: #70757a;
    cursor: pointer;
    align-items: center;
    padding: 0 12px;
    margin: 0 0;
    border: 0;
    background: transparent;
    outline: 0;
}
        </style>`;
    }


}

customElements.define('custom-search', CustomSearch);
/*
<!--
<script src="search.js"></script>
<custom-search></custom-search>
const customCustomSearch = document.querySelector('custom-search');
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
        this.insertItem("/admin.teachers", "老师", "M9 12.984q1.5 0 3.281 0.422t3.258 1.406 1.477 2.203v3h-16.031v-3q0-1.219 1.477-2.203t3.258-1.406 3.281-0.422zM15 12q-0.609 0-1.313-0.234 1.313-1.547 1.313-3.75 0-0.891-0.375-2.016t-0.938-1.781q0.703-0.234 1.313-0.234 1.641 0 2.813 1.195t1.172 2.836-1.172 2.813-2.813 1.172zM5.016 8.016q0-1.641 1.172-2.836t2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172-2.813-1.172-1.172-2.813zM16.688 13.125q2.484 0.375 4.406 1.383t1.922 2.508v3h-4.031v-3q0-2.297-2.297-3.891z");
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

const customStickyHeader = document.querySelector('custom-sticky-header');
let scrollTop = 0;
const wrapper = document.body;
window.addEventListener('scroll', evt => {
    if (scrollTop > wrapper.scrollTop) {
        customStickyHeader.setAttribute('active', '')
    } else {
        customStickyHeader.setAttribute('inactive', '')
    }
    scrollTop = wrapper.scrollTop;
})


let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
let obj, teachers, lessons;
const customSubmitBar = document.querySelector('custom-submit-bar');

const lessonName = document.querySelector('.lesson_name');
lessonName.addEventListener('click', evt => {
    initializeLesson();
})
// const dateTime = document.querySelector('.date_time');
// dateTime.addEventListener('click', evt => {
//     initializeDate()
// })

const peoples = document.querySelector('.peoples');
peoples.addEventListener('click', evt => {
    initializePeoples();
})

const startTime = document.querySelector('.start_time');
startTime.addEventListener('click', evt => {
    initializeStartTime();
})
const endTime = document.querySelector('.end_time');
endTime.addEventListener('click', evt => {
    initializeEndTime();
})

async function getLessons() {
    const response = await fetch(`${baseUri}/api/cards.query`)
    return response.json();
}

async function initializeLesson() {

    if (!lessons) {
        lessons = await getLessons();
    }
    console.log(lessons)
    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        lessonName.setAttribute('value', evt.detail);
        const t = new Date();
        const dateString = `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;
        startTime.setAttribute('value', dateString)
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择会员卡')
    const names = lessons.map(x => x.title);
    customOptions.populateData(names, lessonName.value);
}

async function initializeStartTime() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);
    customSelect.innerHTML = `<div style="display: grid;grid-template-columns: repeat(3,1fr);">
    <custom-picker mode="1"></custom-picker>
    <custom-picker mode="2"></custom-picker>
    <custom-picker mode="3" month="8"></custom-picker>
</div>
<div style="display:flex;align-items: center;justify-content: center;">
    <div style="flex-grow: 1;"></div>
    <button style="font-size: 14px;padding: 0 24px;height: 32px;border-radius: 16px;border: none;background-color: rgb(26, 115, 232);margin: 16px 16px;color: #fff;">确认</button>
</div>`
    customSelect.setAttribute('title', '选择生效日期')
    const customPicker1 = customSelect.querySelector('[mode="1"]');
    const customPicker2 = customSelect.querySelector('[mode="2"]');
    const customPicker3 = customSelect.querySelector('[mode="3"]');
    const m = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(startTime.value);
    if (m) {
        customPicker1.setAttribute('start', parseInt(m[1]));
        customPicker2.setAttribute('start', parseInt(m[2]))
        customPicker3.setAttribute('start', parseInt(m[3]))

    }
    const button = customSelect.querySelector('button');
    button.addEventListener('click', evt => {
        startTime.setAttribute('value', `${customPicker1.value}年${customPicker2.value}月${customPicker3.value}日`);
        customSelect.remove();
    })




}
async function initializeEndTime() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);
    customSelect.innerHTML = `<div style="display: grid;grid-template-columns: repeat(3,1fr);">
    <custom-picker mode="1"></custom-picker>
    <custom-picker mode="2"></custom-picker>
    <custom-picker mode="3" month="8"></custom-picker>
</div>
<div style="display:flex;align-items: center;justify-content: center;">
    <div style="flex-grow: 1;"></div>
    <button style="font-size: 14px;padding: 0 24px;height: 32px;border-radius: 16px;border: none;background-color: rgb(26, 115, 232);margin: 16px 16px;color: #fff;">确认</button>
</div>`
    customSelect.setAttribute('title', '选择生效日期')
    const customPicker1 = customSelect.querySelector('[mode="1"]');
    const customPicker2 = customSelect.querySelector('[mode="2"]');
    const customPicker3 = customSelect.querySelector('[mode="3"]');
    const m = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(startTime.value);
    if (m) {
        customPicker1.setAttribute('start', parseInt(m[1]));
        customPicker2.setAttribute('start', parseInt(m[2]))
        customPicker3.setAttribute('start', parseInt(m[3]))

    }
    const button = customSelect.querySelector('button');
    button.addEventListener('click', evt => {
        endTime.setAttribute('value', `${customPicker1.value}年${customPicker2.value}月${customPicker3.value}日`);
        customSelect.remove();
    })

}

async function initializePeoples() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        peoples.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择可约课次数')

    const names = [...new Array(26).keys()].map(x => (x + 7)).reverse();
    customOptions.populateData(names, peoples.value);
}

customSubmitBar.addEventListener('close', evt => {
    history.back();
});

customSubmitBar.addEventListener('submit', async evt => {
    const card_id = (lessons && lessons.filter(x => x.title === lessonName.value)[0].id) || 0;
    //const date_time = dateToSeconds(dateTime.value);
    const start_date = dateToSeconds(startTime.value);
    const end_date = dateToSeconds(endTime.value);
    const times = parseInt(peoples.value) || 0;

    try {
        const response = await fetch(`${baseUri}/api/card.insert`, {
            method: 'POST',
            body: JSON.stringify({
                card_id,
                start_date,
                end_date,
                times,
                user_id: parseInt(id)
            })
        })
        await response.text();
        document.getElementById('toast').setAttribute('message', '成功');
    } catch (error) {
        document.getElementById('toast').setAttribute('message', '无法更新数据');
    }

});


async function getJson() {
    const response = await fetch(`${baseUri}/api/user.query?id=${id}`);
    return response.json();
}

async function renderUserName() {
    const obj = await getJson();
    const userName = document.querySelector('.user_name');
    userName.setAttribute('value', obj.name || obj.nick_name);
}
renderUserName();
