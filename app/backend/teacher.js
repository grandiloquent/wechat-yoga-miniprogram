setHeader();

function setHeader() {
  const customHeader = document.querySelector('custom-header');
  customHeader.setAttribute('title', "老师");
  [...document.querySelectorAll('[data-href]')]
  .forEach(x => {
    x.addEventListener('click', evt => {
      window.location = evt.currentTarget.dataset.href;
    });
  })
}


const inputDescription = document.querySelector('#input-description');
const inputIntroduction = document.querySelector('#input-introduction');
const inputName = document.querySelector('#input-name');
const inputPhoneNumber = document.querySelector('#input-phone-number');
const inputThumbnail = document.querySelector('#input-thumbnail');
const customSubmitBar = document.querySelector('custom-submit-bar');

const id = new URL(document.URL).searchParams.get('id') || 3;

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/teacher?id=${id}`, {
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
    inputDescription.value = obj.description || '';
    inputIntroduction.value = obj.introduction || '';
    inputName.value = obj.name || '';
    inputPhoneNumber.value = obj.phone_number || '';
    inputThumbnail.innerHTML = `<img style="max-width:100%" src="https://lucidu.cn/images/${obj.thumbnail}">
            <div style="width:24px;height:24px;position:absolute;top:8px;right:8px;border-radius:50%;background:rgba(32,33,36,0.6);color:#fff;display:flex;align-items:center;justify-content:center">
                <svg style="wdith:18px;height:18px" viewBox="0 0 24 24">
<path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
</svg>
                </div>
            `;
    const img = inputThumbnail.querySelector('img');
    img.addEventListener('click', evt => {
      evt.stopPropagation();
      const customImageViewer = document.createElement('custom-image-viewer');
      customImageViewer.setAttribute('src', img.src);
      document.body.appendChild(customImageViewer);
    });
  } catch (error) {

  }
}
render();

const submit = document.querySelector('custom-submit-bar');
submit.addEventListener('submit', async evt => {
  evt.stopPropagation();
  const data = {};
  data.id = id;
  data.title = title.value.trim();
  data.content = content.value.trim();
  try {
    const response = await fetch(`${baseUri}/v1/admin/teacher/update`, {
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


// (() => {
//     function rgbToHex(r, g, b) {
//         return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
//     }
//     console.log(rgbToHex(218, 220, 224))
// })();