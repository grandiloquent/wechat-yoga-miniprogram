let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : '';
const id = new URL(window.location).searchParams.get('id');
const textarea = document.querySelector('textarea');
let translate = 'http://kingpunch.cn';

async function loadData() {
    const response = await fetch(`${baseUri}/api/admin.helps.query`);
    return response.json();
}

async function render() {
    textarea.value = localStorage.getItem('content') || '';
    let obj;
    try {
        obj = await loadData();

        document.querySelector('textarea').value = `# ${obj.title}
        
${obj.content}`;
        document.title = `${obj.title} - 编辑公告`
        //document.getElementById('items').appendChild(fragment);
    } catch (e) {

        document.getElementById('toast').setAttribute('message', '成功');
    }
}

document.getElementById('trans-auto')
    .addEventListener('click', evt => {
        trans(textarea, 1);
    })
document.getElementById('trans-eng')
    .addEventListener('click', evt => {
        trans(textarea, 0);
    })
document.getElementById('upload-img')
    .addEventListener('click', evt => {
        if (id)
            uploadHanlder(textarea);
    })
document.addEventListener('visibilitychange', async ev => {
    localStorage.setItem('content', textarea.value);
});


render();
textarea.addEventListener('keydown', function (e) {
    if (e.keyCode === 9) {
        const p = findExtendPosition(textarea);
        textarea.setRangeText(
            textarea.value.substring(p[0], p[1])
                .split('\n')
                .map(i => {
                    return '\t' + i;
                })
                .join('\n'), p[0], p[1]);
        //this.selectionStart = this.selectionEnd = start + 1;
        // prevent the focus lose
        e.preventDefault();
    }
}, false);

//--------------------------------------
function findExtendPosition(editor) {
    console.log("findExtendPosition, ");
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    let string = editor.value;
    let offsetStart = start;
    while (offsetStart > 0) {
        if (!/\s/.test(string[offsetStart - 1]))
            offsetStart--;
        else {
            let os = offsetStart;
            while (os > 0 && /\s/.test(string[os - 1])) {
                os--;
            }
            if ([...string.substring(offsetStart, os).matchAll(/\n/g)].length > 1) {
                break;
            }
            offsetStart = os;
        }
    }
    let offsetEnd = end;
    while (offsetEnd < string.length) {
        if (!/\s/.test(string[offsetEnd + 1]))
            offsetEnd++;
        else {
            let oe = offsetEnd;
            while (oe < string.length && /\s/.test(string[oe + 1])) {
                oe++;
            }
            if ([...string.substring(offsetEnd, oe + 1).matchAll(/\n/g)].length > 1) {
                offsetEnd++;
                break;
            }
            offsetEnd = oe;
        }
    }
    return [offsetStart, offsetEnd];
}


document.getElementById('save').addEventListener('click', async evt => {
    const sss = textarea.value.trim();
    const index = sss.indexOf('\n');
    const title = sss.substring(0, index).trim().replace(/^#\s+/, '');
    const content = sss.substring(index).trim();
    console.log(title, content);
    const response = await fetch(`${baseUri}/api/admin.helps.insert`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            content
        })
    })
})

async function google(value, english) {
    // https://service-mayeka3y-1258705152.hk.apigw.tencentcs.com/release/
    // https://service-ehkp0lyi-1301282710.hk.apigw.tencentcs.com/release/
    const response = await fetch(`${translate}/translate?q=${encodeURIComponent(value.trim())}&to=${english ? "zh" : "en"}`);
    const obj = await response.text();
    const lines1 = [];
    const lines2 = [];
    const translated = JSON.parse(obj.replaceAll(/您/g, '你').replaceAll(/ - /g, "——"));
    if (translated.sentences) {
        const sentences = translated.sentences;
        for (let index = 0; index < sentences.length; index++) {
            const element = sentences[index];
            lines1.push(element.orig);
            lines2.push(element.trans);
        }
    } else {
        const trans = translated.trans_result;
        for (let index = 0; index < trans.length; index++) {
            const element = trans[index];
            lines1.push(element.src);
            lines2.push(element.dst);
        }
    }
    return [lines1, lines2];
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
    const lines = await google(value, english);
    let results = lines[1].join(' ');
    const pattern = localStorage.getItem('string');
    if (pattern && pattern.trim().length) {
        const values = pattern.split('\n').filter(i => i.trim().length).map(i => i.trim());
        console.log(values);
        for (let i = 0; i < values.length; i += 2) {
            if (i + 1 < values.length) {
                console.log(values[i], values[i + 1])
                results = results.replaceAll(values[i], values[i + 1]);
            }
        }
    }
    editor.setRangeText(`${english ? '' : (lines[0].join(' ') + "\n\n")}${results}`, points[0], points[1]);
}

async function uploadImage(image, name) {
    const form = new FormData();
    form.append('images', image, name)
    const response = await fetch(`http://lucidu.cn/api/article/2`, {
        method: 'POST',
        body: form
    });
    return await response.text();
}

function uploadHandler(editor) {
    tryUploadImageFromClipboard((ok) => {
        const string = `![](https://static.lucidu.cn/images/${ok})\n\n`;
        editor.setRangeText(string, editor.selectionStart, editor.selectionStart);
    }, () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.addEventListener('change', async ev => {
            const file = input.files[0];
            const imageFile = await uploadImage(file, file.name);
            const string = `![](https://static.lucidu.cn/images/${imageFile})\n\n`;
            editor.setRangeText(string, editor.selectionStart, editor.selectionStart);
        });
        input.click();
    });
}

function tryUploadImageFromClipboard(success, error) {
    navigator.permissions.query({
        name: "clipboard-read"
    }).then(result => {
        if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.read().then(data => {
                console.log(data[0].types);
                const blob = data[0].getType("image/png");
                console.log(blob.then(res => {
                    const formData = new FormData();
                    formData.append("images", res, "1.png");
                    fetch(`http://lucidu.cn/api/article/2`, {
                        method: "POST",
                        body: formData
                    }).then(res => {
                        return res.text();
                    }).then(obj => {
                        success(obj);
                    })
                }).catch(err => {
                    console.log(err)
                    error(err);
                }))
            })
                .catch(err => {
                    error(err);
                });
        } else {
            error(new Error());
        }
    });
}

fetch(`${baseUri}/api/accessRecords?path=${encodeURIComponent(window.location.pathname)}&query=${encodeURIComponent(window.location.search)}`, {method: 'DELETE'});
