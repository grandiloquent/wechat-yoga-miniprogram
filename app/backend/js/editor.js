
function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}
function getLine() {
  let start = textarea.selectionStart;
  const strings = textarea.value;

  if (strings[start] === '\n' && start - 1 > 0) {
    start--;
  }
  while (start > 0 && strings[start] != '\n') {
    start--;
  }
  let end = textarea.selectionEnd;
  while (end - 1 < strings.length && strings[end] != '\n') {
    end++;
  }
  return [strings.substring(start, end), start, end]
}
async function translate(value, to) {
  try {
    const response = await fetch(`http://kpkpkp.cn/api/trans?q=${encodeURIComponent(value.trim())}&to=${to}`);
    const obj = await response.json();
    return obj.sentences.map((element, index) => {
      return element.trans;
    }).join(' ');
  } catch (error) {
    console.log(error);
  }
}
async function saveData() {
  const strings = textarea.value.trim();
  const index = strings.indexOf('\n');
  if (index === -1) return;
  const title = strings.substring(0, index).slice(1).trim();
  const content = strings.substring(index).trim();
  try {
    const response = await fetch(`${baseUri}/v1/note`, {
      method: 'POST',
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      },
      body: JSON.stringify({
        id: id,
        title,
        content
      })
    })
    const obj = await response.text();
    if (id)
      document.getElementById('toast').setAttribute('message', '成功');
    else
      window.location = `${window.location.origin}${window.location.pathname}?id=${obj}`

  } catch (error) {
    console.log(error);
  }
}
function getOptions() {
  const line = getLine()[0].trim();
  const names = [];
  let start = 0;
  for (let index = 0; index < line.length; index++) {
    if (line[index] === ' ' || line[index] === '=') {
      names.push(line.substring(start, index).trim())
      start = index + 1;
      while (line[index + 1] === ' ') {
        index++;
      }
      continue;
    }
    else if (line[index] === '"') {
      names.push(line.substring(start, index))
      start = index + 1;
      for (let j = index + 1; j < line.length; j++) {
        const element = line[j];
        if (element === '"') {
          names.push(line.substring(start, j))
          start = j + 1;
          index = j + 1;
          continue;
        }
      }
    }

  }
  names.push(line.substring(start).trim())
  return names;
}
function findBlock(textarea) {
  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;
  const strings = textarea.value;
  if (strings[start] === '\n' && start - 1 > 0) {
    start--;
  }
  let founded = false;
  while (start > 0) {
    if (strings[start] == '\n') {
      let j = start - 1;
      while (j > 0 && /\s/.test(strings[j])) {
        if (strings[j] === '\n') {
          founded = true;
          break;
        }
        j--;
      }
    }
    if (founded) {
      break
    }
    start--;
  }
  founded = false;
  while (end + 1 < strings.length) {
    if (strings[end] == '\n') {
      let j = end + 1;
      while (j + 1 < strings.length && /\s/.test(strings[j])) {
        if (strings[j] === '\n') {
          founded = true;
          break;
        }
        j++;
      }
    }
    if (founded) {
      break
    }
    end++;
  }
  return [start, end]

}

async function loadData() {
  const response = await fetch(`${baseUri}/v1/note?id=${id}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render() {
  let obj;
  try {
    obj = await loadData();
    textarea.value = `# ${obj.title}\n\n${obj.content}`
  } catch (error) {

  }
}
async function uploadImage(image, name) {
  const form = new FormData();
  form.append('images', image, name)
  const response = await fetch(`https://lucidu.cn/v1/picture`, {
    method: 'POST',
    body: form
  });
  return await response.text();
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
          fetch(`https://lucidu.cn/v1/picture`, {
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

function increaseIndent() {
  const points = findBlock(textarea);
  const lines = textarea.value.substring(points[0], points[1]).split('\n')
    .map(x => `    ${x}`);
  textarea.setRangeText(`\n\n${lines.join('\n')}`, points[0], points[1], 'end');
}
function formatOptions() {
  const array = getOptions();
  const buf = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    buf.push(`- \`${element}\`：`);
  }
  textarea.setRangeText(`\n\n${buf.join('\n')}`, textarea.selectionStart, textarea.selectionEnd, 'end');
}
function sortLines() {
  const points = findBlock(textarea);
  const lines = textarea.value.substring(points[0], points[1]).split('\n')
    .sort((x, y) => x.localeCompare(y));
  textarea.setRangeText(`\n\n${lines.join('\n')}`, points[0], points[1], 'end');
}
function upload() {
  if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
    tryUploadImageFromClipboard((ok) => {
      const string = `![](https://static.lucidu.cn/images/${ok})\n\n`;
      textarea.setRangeText(string, textarea.selectionStart, textarea.selectionStart);
    }, (error) => {
      console.log(error);
      const input = document.createElement('input');
      input.type = 'file';
      input.addEventListener('change', async ev => {
        const file = input.files[0];
        const imageFile = await uploadImage(file, file.name);
        const string = `![](https://static.lucidu.cn/images/${imageFile})\n\n`;
        textarea.setRangeText(string, textarea.selectionStart, textarea.selectionStart);
      });
      input.click();
    });
  } else {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', async ev => {
      const file = input.files[0];
      const imageFile = await uploadImage(file, file.name);
      const string = `![](https://static.lucidu.cn/images/${imageFile})\n\n`;
      textarea.setRangeText(string, textarea.selectionStart, textarea.selectionStart);
    });
    input.click();
  }
}

function findExtendPosition(editor) {
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
    if (!/\s/.test(string[offsetEnd + 1])) {

      offsetEnd++;
    } else {

      let oe = offsetEnd;
      while (oe < string.length && /\s/.test(string[oe + 1])) {
        oe++;
      }
      if ([...string.substring(offsetEnd, oe + 1).matchAll(/\n/g)].length > 1) {
        offsetEnd++;

        break;
      }
      offsetEnd = oe + 1;

    }
  }
  while (offsetStart > 0 && string[offsetStart - 1] !== '\n') {
    offsetStart--;
  }
  // if (/\s/.test(string[offsetEnd])) {
  //     offsetEnd--;
  // }
  return [offsetStart, offsetEnd];
}
async function removeLines(textarea) {
  if (textarea.selectionStart !== textarea.selectionEnd) {

    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;

    while (start > -1) {
      if (textarea.value[start] === '\n') {
        let s = [];

        while (start > -1 && /\s/.test(textarea.value[start])) {
          s.push(textarea.value[start])
          start--;
        }
        if ([...s.join('').matchAll(/\n/g)].length > 2) {
          break;
        }
      }
      start--;
    }
    while (end + 1 < textarea.value.length) {
      if (textarea.value[end] === '\n') {
        let s = [];

        while (end + 1 < textarea.value.length && /\s/.test(textarea.value[end])) {
          s.push(textarea.value[end])
          end++;
        }
        if ([...s.join('').matchAll(/\n/g)].length > 2) {
          break;
        }
      }
      end++;
    }
    start++;

    if (typeof NativeAndroid !== 'undefined') {
      NativeAndroid.writeText(textarea.value.substring(start, end));
    } else {
      await navigator.clipboard.writeText(textarea.value.substring(start, end))
    }
    textarea.setRangeText('\n', start, end);
    textarea.selectionEnd = start;
  } else {
    // textarea.value = textarea.value.substring(textarea.selectionEnd);
    // textarea.selectionStart = 0;
    // textarea.selectionEnd = 0;
    // textarea.scrollLeft = 0;
    // textarea.scrollTop = 0;
    const p = findExtendPosition(textarea);

    let start = p[0];

    while (start > -1 && /\s/.test(textarea.value[start - 1])) {
      start--;
    }

    let end = p[1];
    while (end + 1 < textarea.value.length && /\s/.test(textarea.value[end + 1])) end++;

    if (typeof NativeAndroid !== 'undefined') {
      NativeAndroid.writeText(textarea.value.substring(start, end));
    } else {
      await navigator.clipboard.writeText(textarea.value.substring(start, end))
    }
    textarea.setRangeText('\n\n', start, end + 1);
    textarea.selectionEnd = start;
  }

}
async function translationFunction(textarea) {
  const s = getSelectedString(textarea);
  try {
    const response = await fetch(`http://kpkpkp.cn/api/trans?q=${encodeURIComponent(s)}&to=en`);
    const obj = await response.json();
    const n = camel(obj.sentences[0].trans);
    textarea.setRangeText(`${n[0].toLowerCase() + n.slice(1)}`, textarea.selectionStart,
      textarea.selectionEnd)

  } catch (error) {
    console.log(error);
  }
}


function returnToParentDirectory() {
  const path = new URL(document.URL).searchParams.get('path');
  const uri = `/?path=${encodeURIComponent(substringBeforeLast(path, "/"))}&isDir=1`;
  console.log(uri)
  window.location.href = uri
}

function getSelectedString(textarea) {
  return textarea.value.substring(
    textarea.selectionStart,
    textarea.selectionEnd
  );
}


function replaceSelected(textarea) {
  // const selectedString = getSelectedString(textarea).trim();
  // const firstLine = substringBefore(selectedString, "\n").trim().split(' ');
  // const content = substringAfter(selectedString, "\n").trim();
  // replaceSelectedText(textarea, content.replaceAll(
  //   firstLine[0], firstLine[1]
  // ))

  const points = findBlock(textarea);
  const start = points[0];
  const end = points[1];

  let s = textarea.value.substring(start, end).trim();
  console.log(s)

  const n = substringBefore(s, "\n").trim().split(' ');
  textarea.setRangeText(`
${substringAfter(s, '\n').trim().replaceAll(
    n[0], n[1]
  )
    }
`, start, end, "end")

}
function toBlocks(string) {
  let count = 0;
  let buf = [];
  const blocks = [];
  for (let i = 0; i < string.length; i++) {
    buf.push(string[i])
    if (string[i] === '{') {
      count++;
    } else if (string[i] === '}') {
      count--;
      if (count === 0) {
        blocks.push(buf.join(''))
        buf = [];
      }
    }
  }
  return blocks;
}
///////////////////////////////
const snippets = JSON.parse(window.localStorage.getItem('snippets'))

document.querySelectorAll('[bind]').forEach(element => {
  if (element.getAttribute('bind')) {
    window[element.getAttribute('bind')] = element;
  }
  [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
    if (!attr.value) return;
    element.addEventListener(attr.nodeName.slice(1), evt => {
      window[attr.value](evt);
    });
  });
})
customBottomBar.data = [{
  path: `<path d="M21.516 20.484v-13.969q0-0.422-0.305-0.727t-0.727-0.305h-9.047l1.313 3.797h1.453v-1.266h1.266v1.266h4.547v1.313h-1.922q-0.703 2.344-2.391 4.219l3.281 3.281-0.938 0.891-3.094-3.094 1.031 3.094-1.969 2.531h6.469q0.422 0 0.727-0.305t0.305-0.727zM13.172 10.594l0.797 2.344 0.844 1.125q1.453-1.594 2.063-3.469h-3.703zM6.984 15.984q2.156 0 3.492-1.359t1.336-3.516q0-0.047-0.141-1.031h-4.688v1.734h2.953q-0.094 0.891-0.844 1.641t-2.109 0.75q-1.313 0-2.227-0.938t-0.914-2.25q0-1.359 0.914-2.297t2.227-0.938q1.266 0 2.063 0.797l1.313-1.266q-1.453-1.313-3.375-1.313-2.063 0-3.516 1.477t-1.453 3.539 1.453 3.516 3.516 1.453zM21 3.984q0.797 0 1.406 0.609t0.609 1.406v15q0 0.797-0.609 1.406t-1.406 0.609h-9l-0.984-3h-8.016q-0.797 0-1.406-0.609t-0.609-1.406v-15q0-0.797 0.609-1.406t1.406-0.609h6.984l1.031 3h9.984z"></path>
`,
  title: "中文",
  href: "chinese"
}, {
  path: `<path d="M21.516 20.484v-13.969q0-0.422-0.305-0.727t-0.727-0.305h-9.047l1.313 3.797h1.453v-1.266h1.266v1.266h4.547v1.313h-1.922q-0.703 2.344-2.391 4.219l3.281 3.281-0.938 0.891-3.094-3.094 1.031 3.094-1.969 2.531h6.469q0.422 0 0.727-0.305t0.305-0.727zM13.172 10.594l0.797 2.344 0.844 1.125q1.453-1.594 2.063-3.469h-3.703zM6.984 15.984q2.156 0 3.492-1.359t1.336-3.516q0-0.047-0.141-1.031h-4.688v1.734h2.953q-0.094 0.891-0.844 1.641t-2.109 0.75q-1.313 0-2.227-0.938t-0.914-2.25q0-1.359 0.914-2.297t2.227-0.938q1.266 0 2.063 0.797l1.313-1.266q-1.453-1.313-3.375-1.313-2.063 0-3.516 1.477t-1.453 3.539 1.453 3.516 3.516 1.453zM21 3.984q0.797 0 1.406 0.609t0.609 1.406v15q0 0.797-0.609 1.406t-1.406 0.609h-9l-0.984-3h-8.016q-0.797 0-1.406-0.609t-0.609-1.406v-15q0-0.797 0.609-1.406t1.406-0.609h6.984l1.031 3h9.984z"></path>
`,
  title: "英文",
  href: "english"
}, {
  path: `<path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>  `,
  title: "删除",
  href: "removeLine"
}, {
  path: `<path d="M3 6h18v2.016h-18v-2.016zM3 12.984v-1.969h18v1.969h-18zM3 18v-2.016h18v2.016h-18z"></path>`,
  title: "菜单",
  href: "menu"
}, {
  path: `<path d="M15 9v-3.984h-9.984v3.984h9.984zM12 18.984q1.219 0 2.109-0.891t0.891-2.109-0.891-2.109-2.109-0.891-2.109 0.891-0.891 2.109 0.891 2.109 2.109 0.891zM17.016 3l3.984 3.984v12q0 0.797-0.609 1.406t-1.406 0.609h-13.969q-0.844 0-1.43-0.586t-0.586-1.43v-13.969q0-0.844 0.586-1.43t1.43-0.586h12z"></path>
`,
  title: "保存",
  href: "save"
}]
async function navigate(evt) {
  switch (evt.detail) {
    case 'english':
      let array = getLine();
      textarea.setRangeText(`\n\n${await translate(array[0], 'en')
        }
          `, array[1], array[2], 'end');
      break;
    case 'chinese':
      let array1 = getLine();
      textarea.setRangeText(`\n\n${await translate(array1[0], 'zh')
        }
          `, array1[1], array1[2], 'end');
      break;
    case 'save':
      await saveData();
      break;
    case "removeLine":
      await removeLines(textarea);
      break;
    case 'menu':
      const customDialogActions = document.createElement('custom-dialog-actions');
      customDialogActions.addEventListener('submit', evt => {
        switch (evt.detail) {
          case "0":
            customDialogActions.remove();
            formatOptions();
            break;
          case "1":
            customDialogActions.remove();
            increaseIndent();
            break;
          case "2":
            customDialogActions.remove();
            sortLines();
            break;
          case "3":
            customDialogActions.remove();
            sortLines();
            break;
          case "4":
            customDialogActions.remove();
            upload();
            break;
        }
      });
      document.body.appendChild(customDialogActions);
      break;
  }
}
const id = new URL(document.URL).searchParams.get('id') || 0;
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
render();
document.addEventListener('keydown', async evt => {
  if (evt.ctrlKey) {
    switch (evt.key) {
      case 's':
        evt.preventDefault();
        await saveData();
        break
      case 'l':
        evt.preventDefault();
        await textarea.setRangeText(`[${textarea.value.substring(textarea.selectionStart, textarea.selectionEnd)}](${await navigator.clipboard.readText()})`, textarea.selectionStart, textarea.selectionEnd, 'end');
        break
      case 'u':
        evt.preventDefault();
        upload();
        break;
      case 'h':
        replaceSelected(textarea)
        ev.preventDefault();
        break;
    }

  } else if (ev.key === ' ' || ev.keyCode == 229) {

    let start = textarea.selectionStart;
    let end = start;
    if (start > -1)
      start--;
    while (start > -1 && /[a-zA-Z0-9]+/.test(textarea.value[start])) {
      start--;
    }
    start++;
    const key = textarea.value.substring(start, end).trim();
    if (!key) {
      return;
    }
    const value = snippets[key];
    if (!value) {
      return;
    }
    ev.preventDefault();
    textarea.setRangeText(value, start, end, "end");

  } else if (ev.key === "F3") {
    translationFunction(textarea);
    ev.preventDefault();
  } else if (ev.key === 'F7') {
    returnToParentDirectory();
    ev.preventDefault();
  }
})
