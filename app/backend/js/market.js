const customHeader = document.querySelector('custom-header');
customHeader.setAttribute('title', "促销");
[...document.querySelectorAll('[data-href]')]
.forEach(x => {
  x.addEventListener('click', evt => {
    window.location = evt.currentTarget.dataset.href;
  });
})

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id') || 1;

async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/market`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
const title = document.querySelector('.title');
const slogan = document.querySelector('.slogan');

const content = document.querySelector('.content');
const submit = document.querySelector('.submit');

submit.addEventListener('submit', async evt => {
  evt.stopPropagation();
  const data = {};
  data.id = 1;
  data.title = title.value.trim();
  data.slogan = slogan.value.trim();
  data.content = content.value.trim();
  try {
    const response = await fetch(`${baseUri}/v1/admin/market/update`, {
      method: 'POST',
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      },
      body: JSON.stringify(data)
    });
    await response.text();
    document.getElementById('toast').setAttribute('message', '成功');
  } catch (error) {
    console.log(error);
    document.getElementById('toast').setAttribute('message', '失败');
  }
});

async function render() {
  let obj;
  try {
    obj = await loadData();
    title.value = obj.title;
    content.value = obj.content;
    slogan.value = obj.slogan;
  } catch (error) {

  }
}
render();