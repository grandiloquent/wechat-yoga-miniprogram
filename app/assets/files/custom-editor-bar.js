class CustomEditorBar extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `<style>.text
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
.image
{
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke: none;
    color: #030303;
    display: block;
}
.item
{
    display: flex;
    -webkit-box-flex: 1;
    flex: 1 1 0%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    overflow: hidden;
    color: #030303;
}</style>
    <div style="display: flex; justify-content: space-around; position: fixed; bottom: 0; left: 0; right: 0; padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left); z-index: 3; height: 48px; border-top: 1px solid rgba(0,0,0,.1); background: rgba(255,255,255,.98); color: #030303; font-size: 1.1rem;">
      <div style="display: flex; -webkit-box-flex: 1; flex: 1 1 0%; min-width: 0;">
        <div class="item" id="head">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
              <g>
                <path d="M5.016 3.984h13.969v3h-5.484v12h-3v-12h-5.484v-3z">
                </path>
              </g>
            </svg>
          </div>
          <div class="text">
            标题
          </div>
        </div>
        <div class="item" id="english">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M21.516 20.484v-13.969q0-0.422-0.305-0.727t-0.727-0.305h-9.047l1.313 3.797h1.453v-1.266h1.266v1.266h4.547v1.313h-1.922q-0.703 2.344-2.391 4.219l3.281 3.281-0.938 0.891-3.094-3.094 1.031 3.094-1.969 2.531h6.469q0.422 0 0.727-0.305t0.305-0.727zM13.172 10.594l0.797 2.344 0.844 1.125q1.453-1.594 2.063-3.469h-3.703zM6.984 15.984q2.156 0 3.492-1.359t1.336-3.516q0-0.047-0.141-1.031h-4.688v1.734h2.953q-0.094 0.891-0.844 1.641t-2.109 0.75q-1.313 0-2.227-0.938t-0.914-2.25q0-1.359 0.914-2.297t2.227-0.938q1.266 0 2.063 0.797l1.313-1.266q-1.453-1.313-3.375-1.313-2.063 0-3.516 1.477t-1.453 3.539 1.453 3.516 3.516 1.453zM21 3.984q0.797 0 1.406 0.609t0.609 1.406v15q0 0.797-0.609 1.406t-1.406 0.609h-9l-0.984-3h-8.016q-0.797 0-1.406-0.609t-0.609-1.406v-15q0-0.797 0.609-1.406t1.406-0.609h6.984l1.031 3h9.984z" />
            </svg>
          </div>
          <div class="text">
            翻译
          </div>
        </div>
        <div class="item" id="save">
          <div class="image">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M15 9v-3.984h-9.984v3.984h9.984zM12 18.984q1.219 0 2.109-0.891t0.891-2.109-0.891-2.109-2.109-0.891-2.109 0.891-0.891 2.109 0.891 2.109 2.109 0.891zM17.016 3l3.984 3.984v12q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.844 0.586-1.43t1.43-0.586h12z" />
            </svg>
          </div>
          <div class="text">
            保存
          </div>
        </div>
      </div>
    </div>`;

    }


    static get observedAttributes() {
        return ['title'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
        const textarea = document.querySelector('textarea');
        tab(textarea);
        document.addEventListener('visibilitychange', async ev => {
            localStorage.setItem('content', textarea.value);
        });
        this.root.querySelector('#head').addEventListener('click', evt => {
            evt.stopPropagation();
            formatHead(textarea, 2);
        });
        this.root.querySelector('#english').addEventListener('click', async evt => {
            evt.stopPropagation();
            await trans(textarea, 0);
        });
        this.root.querySelector('#save').addEventListener('click', async evt => {
            evt.stopPropagation();
            saveData(textarea);
        });


        render(textarea);
        document.addEventListener('keydown', async ev => {
            if (ev.key === 'F3') {
                ev.preventDefault();
                await trans(textarea, 0);
            } else if (ev.key === 'F5') {
                ev.preventDefault();
                saveData();
            }
        });
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        }
    }

}

customElements.define('custom-editor-bar', CustomEditorBar);

/*
<!--\
<custom-editor-bar></custom-editor-bar>
<script src="custom-editor-bar.js"></script>

const customEditorBar = document.querySelector('custom-editor-bar');
customEditorBar.addEventListener('submit', evt => {
            evt.stopPropagation();
        });

const customEditorBar = document.createElement('custom-editor-bar');
customEditorBar.setAttribute('title','');
document.body.appendChild(customEditorBar);
this.dispatchEvent(new CustomEvent('submit', {
detail: evt.currentTarget.dataset.index
}))
-->
*/


function formatHead(editor, count) {
    // console.log("formatHead, ");
    // let start = editor.selectionStart;
    // const string = editor.value;
    // while (start - 1 > -1 && string.charAt(start - 1) !== '\n') {
    //     start--;
    // }
    // editor.setRangeText('#'.repeat(count || 2) + " ", start, start);
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const string = editor.value;
    let offsetStart = start;
    while (offsetStart > 0) {
        if (string[offsetStart - 1] !== '\n')
            offsetStart--;
        else {
            // while (offsetStart > 0) {
            //     if (/\s/.test(string[offsetStart - 1]))
            //         offsetStart--;
            //     else break;
            // }
            break;
        }
    }
    let offsetEnd = end;
    while (offsetEnd < string.length) {
        if (string[offsetEnd + 1] !== '\n')
            offsetEnd++;
        else {
            /* while (offsetEnd < string.length) {
                 if (/\s/.test(string[offsetEnd + 1]))
                     offsetEnd++;
                 else break;
             }*/
            //offsetEnd++;
            break;
        }
    }
    const str = string.substring(offsetStart, offsetEnd).trim();
    if (!str.startsWith('//')) {
        editor.setRangeText(`// ${str}`, offsetStart,
            offsetEnd);
    }
    editor.selectionStart = offsetEnd;
    editor.selectionEnd = offsetEnd;

}

function formatList(textarea) {
    const p = findExtendPosition(textarea);
    textarea.setRangeText(
        textarea.value.substring(p[0], p[1])
            .split('\n')
            .map(i => {
                // console.log(i);
                // if (i.startsWith('*')) {
                //     return i.substring(2);
                // } else {}
                return '- ' + i;
            })
            .join('\n'), p[0], p[1]);
}

function tab(textarea) {
    textarea.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) {
            const p = findExtendPosition(textarea);
            const start = this.selectionStart;
            textarea.setRangeText(
                textarea.value.substring(p[0], p[1])
                    .split('\n')
                    .map(i => {
                        return '\t' + i;
                    })
                    .join('\n'), p[0], p[1]);
            this.selectionStart = this.selectionEnd = start + 1;
            // prevent the focus lose
            e.preventDefault();
        }
    }, false);
}

async function trans(editor, english) {
    // let start = editor.selectionStart;
    // let end = editor.selectionEnd;
    // const string = editor.value;
    // while (start > 0 && string[start - 1] !== '\n') {
    //     start--;
    // }
    // while (end < string.length) {
    //     end++;
    //     if (string[end] === '\n') break;
    // }
    // const value = string.substring(start, end);
    // if (!value.trim()) return;
    // const lines = await google(value, english);
    // editor.setRangeText(`${lines[0].join(' ')}\n\n${lines[1].join(' ')}`, start, end);
    const points = findExtendPosition(editor);
    const string = editor.value.substring(points[0], points[1]);

    const value = string.replaceAll(/\n/g, ' ');
    if (!value.trim()) return;

    const lines = await google(value.replace(/\d+[\r\n\s]+(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/, "").trim(), english);
    let results = lines[1].join(' ');
    const pattern = localStorage.getItem('string');
    if (pattern && pattern.trim().length) {
        const values = pattern.split('\n').filter(i => i.trim().length).map(i => i.trim());
        console.log(values);
        for (let i = 0; i < values.length; i += 2) {
            if (i + 1 < values.length) {
                results = results.replaceAll(values[i], values[i + 1]);
            }
        }
    }
    let year = '';
    let matchYear = /\d{4}/.exec(value);
    if (matchYear) {
        year = matchYear[0] + '年'
    }
    console.log('---------------->', results)
    // string
    // \n\n${year}
    editor.setRangeText(`${english ? '' : (lines[0].join(' '))}\n${results}`, points[1], points[1]);
}

let translate = 'http://kpkpkp.cn/api/trans';

async function google(value, english) {
    // /translate
    // https://service-mayeka3y-1258705152.hk.apigw.tencentcs.com/release/
    // https://service-ehkp0lyi-1301282710.hk.apigw.tencentcs.com/release/
    const response = await fetch(`${translate}?q=${encodeURIComponent(value.trim())}&to=${english ? "zh" : "en"}`);
    const obj = await response.text();
    const lines1 = [];
    const lines2 = [];
    const translated = JSON.parse(obj.replaceAll(/您/g, '你').replaceAll(/ - /g, "——"));
    if (translated.sentences) {
        const sentences = translated.sentences;
        for (let index = 0; index < sentences.length; index++) {
            const element = sentences[index];
            //lines1.push(element.orig);
            lines2.push(element.trans);
        }
    } else {
        const trans = translated.trans_result;
        for (let index = 0; index < trans.length; index++) {
            const element = trans[index];
            // lines1.push(element.src);
            lines2.push(element.dst);
        }
    }
    return [lines1, lines2];
}

async function saveData(textarea) {
    await submitData(textarea);

}

async function submitData(textarea) {
    const searchParams = new URL(window.location.href).searchParams;
    const path = searchParams.get('path');
    const response = await fetch(`/api/save?path=${path}`, {
        method: 'POST',
        body: textarea.value
    });
    const res = await response.text();
    document.getElementById('toast').setAttribute('message', '成功');


}

async function loadData(baseUri, path) {
    
    const response = await fetch(`${baseUri}/api/files?path=${path}&isDir=0`);
    return await response.text();
}

async function render(textarea) {
    //textarea.value = localStorage.getItem("content");
    const searchParams = new URL(window.location.href).searchParams;
    const path = searchParams.get('path');
    let baseUri = '';
    if (path) {
        try {
            textarea.value = await loadData(baseUri, path);
        } catch (error) {

        }
    }
}

/*
console.log([...document.querySelectorAll('.slide-image-wrap img')]
    .map((x, index) => {
        return `${x.src.split('?')[0]}\n\tout=${index + 1}.jpg`;
    }).reverse()
    .join('\n'))
    */