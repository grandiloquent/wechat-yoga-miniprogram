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

function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
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
function getLine(isArray) {
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
  if (isArray) {
    return [start, end]
  }
  return strings.substring(start, end);
}
const id = new URL(document.URL).searchParams.get('id') || 0;
async function saveData() {
  const strings = textarea.value.trim();
  const index = strings.indexOf('\n');
  if (index === -1) return;
  const title = strings.substring(0, index).slice(1).trim();
  const content = strings.substring(index).trim();
  try {
    const response = await fetch(`${baseUri}/v1/admin/note`, {
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
  const line = getLine().trim();
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
async function navigate(evt) {
  switch (evt.detail) {
    case 'english':
      let array = getLine(1);
      textarea.setRangeText(`\n\n${await translate(getLine(), 'en')
        }
          `, array[0], array[1], 'end');
      break;
    case 'chinese':
      array = getLine(1);
      textarea.setRangeText(`\n\n${await translate(getLine(), 'zh')
        }
          `, array[0], array[1], 'end');
      break;
    case 'save':
      await saveData();
      break;
    case 'menu':
      const customDialogActions = document.createElement('custom-dialog-actions');
      customDialogActions.addEventListener('submit', evt => {
        switch (evt.detail) {
          case "0":
            customDialogActions.remove();
            const array = getOptions();
            const buf = [];
            for (let index = 0; index < array.length; index++) {
              const element = array[index];
              buf.push(`- \`${element}\`：`);
            }
            textarea.setRangeText(`\n\n${buf.join('\n')}`, textarea.selectionStart, textarea.selectionEnd, 'end');
            break;
          case "1":
            customDialogActions.remove();
            const points = findBlock(textarea);
            const lines = textarea.value.substring(points[0], points[1]).split('\n')
              .map(x => `    ${x}`);
            textarea.setRangeText(`\n\n${lines.join('\n')}`, points[0], points[1], 'end');
            break;
        }
      });
      document.body.appendChild(customDialogActions);
      break;
  }

}
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/note?id=${id}`, {
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
render();
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
        break;
    }

  }
})