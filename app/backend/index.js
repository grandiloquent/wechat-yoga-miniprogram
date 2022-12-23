setHeader();

function setHeader() {
  const customHeader = document.querySelector('custom-header');
  customHeader.setAttribute('title', "管理员");
  [...document.querySelectorAll('[data-href]')].forEach(x => {
    x.addEventListener('click', evt => {
      window.location = evt.currentTarget.dataset.href;
    });
  })
}

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/login`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render() {
  try {
    await loadData()
  } catch (error) {
    window.location = `/backend/login?returns=${encodeURIComponent(window.location.href)}`
  }
}
render();