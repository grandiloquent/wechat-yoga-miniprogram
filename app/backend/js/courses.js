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
  path: `<path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>`,
  title: "新建",
  href: "course"
}]

function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/lesson/names`, {
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
async function navigate(evt) {
  switch (evt.detail) {
    case 'course':
      location = "./course"
      break;
  }
}