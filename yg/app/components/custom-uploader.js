import {
  LitElement,
  html,
  css
} from './lit-core.min.js';
export class CustomUploader extends LitElement {
  static properties = {
    data: {},
    images: {},
    max: {}
  };
  static styles = css`.wrapper {
  display: flex;
  flex-wrap: wrap;
}

.preview {
  position: relative;
  margin: 0 8px 8px 0;
  cursor: pointer;
}

.preview-image {
  position: relative;
  display: block;
  width: 80px;
  height: 80px;
  overflow: hidden;
}

.img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-delete {
  position: absolute;
  top: 0;
  right: 0;
  width: 14px;
  height: 14px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0 0 0 12px;
  color: #fff;
  fill: currentColor;

}

.preview-delete>svg {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 12px;
  height: 12px;
}

.upload {
  position: relative;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  margin: 0 8px 8px 0;
  background-color: #f7f8fa;
}

.input {
  -webkit-font-smoothing: antialiased;
  -webkit-box-direction: normal;
  color: inherit;
  font: inherit;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  opacity: 0;
}

.upload-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  color: #dcdee0;
}

.upload-icon>svg {
  width: 24px;
  height: 24px;
  fill: currentcolor;
}

. {
  -webkit-box-direction: normal;
  position: relative;
}px;fill:currentcolor;
}
`;
  constructor() {
    super();
    this.data = {

      multiple: false
    };
    this.images = []
    this.max = 1;
  }
  navigate(evt) {
    const index = evt.currentTarget.dataset.index;
    let images = [];
    for (let j = 0; j < this.images.length; j++) {
      if (this.images[j] !== index) {
        images.push(this.data.images[j])
      }
    }
    this.images = images;
    this.dispatchEvent(new CustomEvent('submit', {
      detail: index
    }));
  }
  async _change(evt) {
    if (this.max === 1) {
      const image = evt.target.files[0];
      const file = await uploadImage(image, image.name);
      this.images = [`https://static.lucidu.cn/images/${file}`];
    }
  }
  render() {
    return html`<div class="wrapper">
  <div class="preview">
   ${this.images.map((element, index) => {
      return html`<div class="preview-image">
      <img class="img" src=${element}>
    </div>
    <div class="preview-delete" data-index=${element} @click=${this.navigate}>
      <svg viewBox="0 0 24 24">
        <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>
      </svg>
    </div>`;
    })}
  </div>
  <div class="upload">
    <div class="upload-icon">
      <svg viewBox="0 0 24 24">
        <path d="M12 17.016q2.063 0 3.539-1.477t1.477-3.539-1.477-3.539-3.539-1.477-3.539 1.477-1.477 3.539 1.477 3.539 3.539 1.477zM9 2.016h6l1.828 1.969h3.188q0.797 0 1.383 0.609t0.586 1.406v12q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-12q0-0.797 0.586-1.406t1.383-0.609h3.188zM8.813 12q0-1.313 0.938-2.25t2.25-0.938 2.25 0.938 0.938 2.25-0.938 2.25-2.25 0.938-2.25-0.938-0.938-2.25z"></path>
        </svg>
    </div>
    <input class="input" ?multiple=${this.max > 1} type="file" accept="image/*" @change=${this._change} >
  </div>
</div>`;
  }
  connectedCallback() {
    super.connectedCallback();
  }
}
customElements.define('custom-uploader', CustomUploader);
/*
<!--
<script type="module" src="../components/custom-uploader.js"></script>
<custom-uploader bind @submit=""></custom-uploader>
                                         -->
                                     */
async function uploadImage(image, name) {
  let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : 'https://lucidu.cn'
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
  const form = new FormData();
  form.append('images', image, name)
  const response = await fetch(`${baseUri}/v1/picture`, {
    method: 'POST',
    body: form
  });
  return await response.text();
}