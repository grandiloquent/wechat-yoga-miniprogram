function setHeader() {
  const customHeader = document.querySelector('custom-header');
  customHeader.setAttribute('title', "公告");
  [...document.querySelectorAll('[data-href]')]
  .forEach(x => {
    x.addEventListener('click', evt => {
      window.location = evt.currentTarget.dataset.href;
    });
  });
}

function appendChild(parent, textContent, className) {
  const div = document.createElement('div');
  className && (div.className = className);
  textContent && (div.textContent = textContent);
  parent.appendChild(div);
  return div;
}
setHeader();
const wrapper = document.querySelector('.wrapper');
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/notices`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}

function appendCloseButton(div) {
  const svg = document.createElement('div');
  svg.style = 'width:24px;height:24px;color:#5f6368;fill:currentColor';
  svg.innerHTML = `<svg viewBox="0 0 24 24">
<path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
</svg>`;
  bindCloseButton(svg);
  div.appendChild(svg);
}

function showCloseDialog(id) {
  const customDialog = document.createElement('custom-dialog');
  customDialog.addEventListener('submit', submitCloseHandler);
  customDialog.dataset.id = id;
  document.body.appendChild(customDialog);
}

function bindCloseButton(svg) {
  svg.addEventListener('click', evt => {
    showCloseDialog(evt.currentTarget.parentNode.dataset.id);
  });
}

async function submitCloseHandler(evt) {
  evt.stopPropagation();
  const id = evt.currentTarget.dataset.id;
  console.log(id);
  evt.currentTarget.remove();
  try {
    const res = await fetch(`${baseUri}/v1/admin/notice/delete?id=${id}`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    });
    if (res.status > 399 || res.status < 200) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    await res.text();
    await render();
  } catch (error) {
    console.log(error);
  }

}
async function render() {
 wrapper.innerHTML='';
  let obj;
  try {
    obj = await loadData();
    obj.forEach(value => {
      const div = document.createElement('div');
      div.addEventListener('click', evt => {
        evt.stopPropagation();
      });
      div.dataset.id = value.id;
      div.className = "item";
      appendChild(div, value.title, "item-title");
      appendCloseButton(div);

      wrapper.appendChild(div);
    })
  } catch (error) {

  }
}
render();