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
async function navigate(evt) {
  switch (evt.detail) {
    case 'translate':
      textarea.setRangeText(`\
          n\ n$ {
            await translate(getLine(), 'en')
          }
          `, textarea.selectionStart, textarea.selectionEnd, 'end');
      break;
    case 'save':
      await saveData();
      break;
    case 'menu':
      const customDialogActions = document.createElement('custom-dialog-actions');
      customDialogActions.addEventListener('click', evt => {
        switch (evt.detail) {
          case 1:
            customDialogActions.remove();
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
        await textarea.setRangeText(`[${textarea.value.substring(textarea.selectionStart,textarea.selectionEnd)}](${await navigator.clipboard.readText()})`, textarea.selectionStart, textarea.selectionEnd, 'end');
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