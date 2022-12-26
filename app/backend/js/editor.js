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
    }

  }
})