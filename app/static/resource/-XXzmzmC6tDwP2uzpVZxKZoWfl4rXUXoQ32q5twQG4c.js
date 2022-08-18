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

(function () {
    class CustomUploader extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({ mode: 'open' });
            this.container = document.createElement('div');
            this.root.appendChild(this.container);
            this.container.innerHTML = CustomUploader.template();
        }

        static get observedAttributes() {
            return ['uri', 'host', 'max', 'images', 'title'];
        }

        connectedCallback() {
            // this.dispatchEvent(new CustomEvent());
            const button = this.root.querySelector('#button');
            const items = this.root.querySelector('#items');
            items.addEventListener('click', evt => {
                evt.stopPropagation();
            });
            this.items = items;
            this.button = button;

            button.addEventListener('click', evt => {
                evt.stopPropagation();
                this.uploadImage();
            });
            this.root.querySelector('#images .button').addEventListener('click', evt => {
                evt.stopPropagation();
                this.uploadImage();
            });
        }

        disconnectedCallback() {
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            if (attrName === 'uri') {
                this.uri = newVal;
            } else if (attrName === 'host') {
                this.host = newVal;
            } else if (attrName === 'max') {
                this.max = newVal;
            } else if (attrName === 'images') {
                this.button.parentNode.style.display = 'none';
                this.items.style.display = 'block';
                JSON.parse(newVal).forEach(x => this.appendImagePreview(x))
            } else if (attrName === 'title') {
                this.root.querySelector('#title').textContent = newVal;
            }
        }

        static template() {
            return `
        ${CustomUploader.style()}

    <div id="title" style="color: #202124; font-size: 16px; font-weight: 500; line-height: 24px; padding-bottom: 2px;">
      课程照片
    </div>
    <div style="color: #70757a; font-size: 16px; font-weight: 400; line-height: 24px;">
      <slot name="subtitle">
      </slot>
    </div>
    <div style="color: rgba(0,0,0,.87); margin-bottom: 12px; margin-top: 12px;">
      <div id="button" style="align-items: center; background: transparent; border-radius: 9999px; border: 1px solid #dadce0; box-shadow: none; box-sizing: border-box; color: #3c4043; display: inline-flex; font-size: 14px; height: 36px; justify-content: center; margin-bottom: 6px; margin-top: 6px; min-width: 64px; padding: 0 16px 0 12px;">
        <div style="color: #1a73e8; height: 18px; margin-right: 8px; width: 18px; fill: currentColor;">
          <svg style="width: 100%; height: 100%;" viewBox="0 0 24 24" focusable="false" class="NMm5M">
            <path d="M20 10h-2V7h-3V5h3V2h2v3h3v2h-3v3zm-4 3c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm4-1v7H4V7h9V3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-7h-2z">
            </path>
          </svg>
        </div><span>添加照片
        </span>
      </div>
    </div>
    <!--display: none-->
    <div id="items" style="height: 96px; width: 100%; margin: 12px 0;display: none">
<!--      <div style="height: 100%; overflow-y: hidden; overflow-x: auto; white-space: nowrap;">-->
        <div id="images" style="display: flex;flex-wrap: wrap;gap: 8px;">
          <div class="button" style="padding: 0 23px 0 23px; border: 1px solid #dadce0; border-radius: 16px; margin:0 0 8px 0; width: 112px; height: 96px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #1a73e8; background: rgba(26,115,232,.04);">
            <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
              <path d="M9.797 14.016q0-1.359 0.938-2.297t2.25-0.938q1.359 0 2.297 0.938t0.938 2.297q0 1.313-0.938 2.25t-2.297 0.938-2.273-0.914-0.914-2.273zM12.984 18.984q2.063 0 3.539-1.453t1.477-3.516-1.477-3.539-3.539-1.477-3.516 1.477-1.453 3.539 1.453 3.516 3.516 1.453zM6 9.984v-3h3v-3h6.984l1.828 2.016h3.188q0.797 0 1.406 0.609t0.609 1.406v12q0 0.797-0.609 1.383t-1.406 0.586h-15.984q-0.797 0-1.406-0.586t-0.609-1.383v-10.031h3zM3 3.984v-3h2.016v3h3v2.016h-3v3h-2.016v-3h-3v-2.016h3z">
              </path>
            </svg>
          </div>
          
          
          
        </div>
<!--      </div>-->
    </div>
  
   `;
        }

        static style() {
            return `
        <style>
        </style>`;
        }

        createInput() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = false;
            input.accept = 'image/*';
            input.style.position = 'fixed';
            input.style.left = '-100%';
            document.body.appendChild(input);
            return input;
        }

        appendImagePreview(src) {
            if (!src.startsWith('https://')) {
                src = `${this.host}/${src}`
            }
            const template = `<div style="position: relative; overflow: hidden; border: 1px solid #dadce0; border-radius: 16px; margin:0 0 8px 0; width: 112px; height: 96px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #1a73e8; background: rgba(26,115,232,.04);">
            <div id="close" style="position: absolute; right: 8px; top: 8px; height: 32px; width: 32px; background: rgba(32,33,36,.6); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 24px; height: 24px; fill: #fff;" viewBox="0 0 24 24">
                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z">
                </path>
              </svg>
            </div>
            <img style="max-width: 100%; object-fit: contain;" src="${src}" />
          </div>`;
            const div = document.createElement('div');
            div.className = 'image'
            div.innerHTML = template;
            div.dataset.src = src;
            div.querySelector('#close').addEventListener('click', evt => {
                div.remove();
                this.dispatchEvent(new CustomEvent('remove', {
                    detail: src
                }));
            });
            if (parseInt(this.max) === 1) {
                this.root.querySelectorAll('.image')
                    .forEach(x => x.remove())
            }
            this.items.querySelector('#images').appendChild(div);
        }

        uploadImage() {
            const input = this.createInput();
            input.addEventListener('change', async evt => {
                const formData = createUploadData(input)
                const text = await uploadData(this.uri, formData);
                this.button.parentNode.style.display = 'none';
                this.items.style.display = 'block';
                this.appendImagePreview(text);
                this.dispatchEvent(new CustomEvent('upload', {
                    detail: [...this.root.querySelectorAll('.image')]
                        .map(x => x.dataset.src)
                }));
            })
            input.click();
        }
    }

    async function uploadData(uri, formData) {
        const res = await fetch(uri, {
            method: 'POST',
            body: formData
        });
        return await res.text();
    }

    function createUploadData(input) {
        const formData = new FormData();
        formData.append("images", input.files[0], input.files[0].name)
        return formData;
    }

    customElements.define('custom-uploader', CustomUploader);
    /*
    <!--
    <script src="uploader.js"></script>
    <custom-uploader></custom-uploader>
    const customCustomUploader = document.querySelector('custom-uploader');
    -->
    */
})()
class CustomAction extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomAction.template();


    }


    static get observedAttributes() {
        return ['head', 'subhead'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'head') {
            this.root.querySelector('#head').textContent = newVal;
        }
        if (attrName === 'subhead') {
            this.root.querySelector('#subhead').textContent = newVal;
        }
    }

    static template() {
        return `
        ${CustomAction.style()}
    <div style="border-top: solid 1px #dadce0; padding: 0 16px; height: 48px; align-items: center; color: #202124; display: flex; font-size: 14px; line-height: 20px;">
    <span id="head" style="flex-grow:1">
    </span>  
      <span id="subhead" style="color:#969799;margin-right:4px" >
      </span> 
    <div style="flex-shrink: 0;width: 20px; height: 20px;  color: #969799; fill: currentColor;">
    <svg style="width:100%;height:100%" viewBox="0 0 24 24">
    <path d="M5.859 4.125l2.156-2.109 9.984 9.984-9.984 9.984-2.156-2.109 7.922-7.875z"></path>
    </svg>
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

customElements.define('custom-action', CustomAction);
/*
<!--
<script src="action.js"></script>
<custom-action></custom-action>
const customCustomAction = document.querySelector('custom-action');
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
class CustomInput extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomInput.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());

        // const textarea = this.root.querySelector('textarea');
        // textarea.focus();
        // textarea.addEventListener('click', evt => {
        //     evt.stopPropagation();
        // });

        this.close = this.root.querySelector('#close');
        this.close.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
        });

        this.closeButton = this.root.querySelector('#close-button');
        this.closeButton.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
        });

        this.ok = this.root.querySelector('#ok');
        this.ok.addEventListener('click', evt => {
            evt.stopPropagation();
            this.remove();
            this.dispatchEvent(new CustomEvent('submit',
            //     {
            //     detail: textarea.value
            // }
            ));
        });


    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'text') {
            this.root.querySelector('textarea').value = newVal;
        }
    }

    static template() {
        return `
        ${CustomInput.style()}

    <div style="position: fixed; left: 0; top: 0; right: 0; bottom: 0; display: flex; background: #fff; flex-direction: column;">
      <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <div style="height: 48px; border-bottom: 1px solid #dadce0; width: 100%; display: flex;">
          <div style="flex-grow: 1;">
          </div>
          <div id="close-button" style="width: 48px; height: 48px;">
            <svg style="width: 24px; height: 24px; margin-top: 12px; margin-left: 12px;" viewBox="0 0 24 24">
              <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z">
              </path>
            </svg>
          </div>
        </div>
        <div style="flex-grow: 1;width: 100%">
          <slot>
          </slot>
        </div>
      </div>
      <div class="buttons">
        <div id="close" class="button" style="border-right: 1px solid #dadce0;">
          取消
        </div>
        <div id="ok" class="button">
          确定
        </div>
      </div>
    </div>
  
   `;
    }

    static style() {
        return `
        <style>
             .buttons{
border-top: 1px solid #dadce0; width: 100%; height: 56px; flex-shrink: 0; display: flex; align-items: center;
}
.button
{
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 400;
    background-color: #fff;
    color: #1a73e8;
    height: 100%;
    width: 50%;
}

        </style>`;
    }


}

customElements.define('custom-input', CustomInput);
/*
<!--
<script src="input.js"></script>
<custom-input></custom-input>
const customCustomInput = document.querySelector('custom-input');
-->


*/
let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = parseInt(new URL(window.location).searchParams.get('id') || getCookie('UserId'));
let obj;

async function loadData() {
    const response = await fetch(`${baseUri}/api/user.query?id=${id}`);
    return response.json();
}

async function render() {
    try {
        obj = await loadData();
        console.log(obj)
        // address
        document.querySelector('#field-name span').textContent = obj.nick_name || '未设置';
        document.querySelector('#field-address span').textContent = obj.address || '未设置';
        document.querySelector('#field-gender span').textContent = (obj.gender === 1 && '男') ||(obj.gender === 2 && '女') || '未设置';
        document.querySelector('#field-phone span').textContent = obj.phone || '未设置';
        customUploader.setAttribute('title', '用户头像');
        customUploader.setAttribute('images', JSON.stringify([obj.avatar_url]));
    } catch (e) {
        console.log(e)
        document.getElementById('toast').setAttribute('message', '成功');
    }
}

render();


const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
    evt.stopPropagation();
    const res = await fetch(`${baseUri}/api/user`, {
        method: 'POST',
        body: JSON.stringify({
            id: id,
            avatar_url: evt.detail[0]
        })
    });
    const obj = await res.text();
});

const fieldName = document.querySelector('#field-name');

fieldName.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = obj.nick_name;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                name: textarea.value
            })
        });
        obj.nick_name = textarea.value;
    })
});

const fieldAddress = document.querySelector('#field-address');

fieldAddress.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = obj.address;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                address: textarea.value
            })
        });
        obj.address = textarea.value;
    })
});


const fieldGender = document.querySelector('#field-gender');

fieldGender.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value =(obj.gender === 1 && '男') ||(obj.gender === 2 && '女') || '未设置';
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                gender: (textarea.value.indexOf('男') !== -1 && 1) || (textarea.value.indexOf('女') !== -1 && 2) || 0
            })
        });
        obj.gender = textarea.value;
    })
});

