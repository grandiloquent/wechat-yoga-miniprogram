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
  const response = await fetch(`${baseUri}/v1/admin/notices`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render() {
  const wrapper = document.querySelector('.wrapper');
  let obj;
  try {
    obj = await loadData();
    obj.forEach(value => {
      const div = document.createElement('div');
      div.textContent = value.title;
      div.addEventListener('click', evt => {
        evt.stopPropagation();
      });
      wrapper.appendChild(div);
    })
  } catch (error) {
  }
}
render();