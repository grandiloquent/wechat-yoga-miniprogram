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

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/login`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.text();
}
async function render() {
  try {
    await loadData()
  } catch (error) {
console.log(error);
   window.location = `/backend/login?returns=${encodeURIComponent(window.location.href)}`
  }
}
render();