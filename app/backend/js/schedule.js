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
  const response = await fetch(`${baseUri}/v1/admin/lesson/info`, {
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
    startTime.data = paddingArray([...new Array(25).keys()].map(x => {
      const m = x * 30 + 60 * 9;
      return `${m / 60 | 0}:${(m % 60).toString().padEnd(2, '0')}`;
    }));
    lesson.data = paddingArray(obj.lessons);

  } catch (error) {

  }
}
render();

function paddingArray(array) {
  const dif = array.length % 4;
  for (let j = 0; j < 4 - dif; j++) {
    array.push('');
  }
  return array;
}