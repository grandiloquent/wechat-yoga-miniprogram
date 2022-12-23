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
            <div class="close">
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
    inputThumbnail.querySelector('.close').addEventListener('click', evt => {
      const input = document.createElement('input');
      input.type = "file";
      input.accept = "image/*";
      input.style = "display:fixed;left:-100%";
      document.body.appendChild(input);
      input.click();
      input.addEventListener('change', async evt => {
        input.remove();
        const formData = new FormData();
        formData.append("images", input.files[0]);
        const res = await fetch(`${baseUri}/v1/picture`, {
          method: 'POST',
          body: formData
        });
        const src = await res.text();
        img.src = `https://lucidu.cn/images/${src}`;
        inputThumbnail.dataset.src = src;
      });
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
  data.description = inputDescription.value.trim();
  data.introduction = inputIntroduction.value.trim();
  data.name = inputName.value.trim();
  data.phone_number = inputPhoneNumber.value.trim();
  if (inputThumbnail.dataset.src) {
    data.thumbnail = inputThumbnail.dataset.src;
  }
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