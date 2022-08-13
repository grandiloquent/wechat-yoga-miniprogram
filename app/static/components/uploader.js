(function () {
    class CustomUploader extends HTMLElement {
        constructor() {
            super();
            this.root = this.attachShadow({ mode: 'open' });
            this.container = document.createElement('div');
            this.root.appendChild(this.container);
            this.container.innerHTML = CustomUploader.template();
        }

        static get observedAttributes() {
            return ['uri', 'host', 'max', 'images', 'title'];
        }

        connectedCallback() {
            // this.dispatchEvent(new CustomEvent());
            const button = this.root.querySelector('#button');
            const items = this.root.querySelector('#items');
            items.addEventListener('click', evt => {
                evt.stopPropagation();
            });
            this.items = items;
            this.button = button;

            button.addEventListener('click', evt => {
                evt.stopPropagation();
                this.uploadImage();
            });
            this.root.querySelector('#images .button').addEventListener('click', evt => {
                evt.stopPropagation();
                this.uploadImage();
            });
        }

        disconnectedCallback() {
        }

        attributeChangedCallback(attrName, oldVal, newVal) {
            if (attrName === 'uri') {
                this.uri = newVal;
            } else if (attrName === 'host') {
                this.host = newVal;
            } else if (attrName === 'max') {
                this.max = newVal;
            } else if (attrName === 'images') {
                this.button.parentNode.style.display = 'none';
                this.items.style.display = 'block';
                JSON.parse(newVal).forEach(x => this.appendImagePreview(x))
            } else if (attrName === 'title') {
                this.root.querySelector('#title').textContent = newVal;
            }
        }

        static template() {
            return `
        ${CustomUploader.style()}

    <div id="title" style="color: #202124; font-size: 16px; font-weight: 500; line-height: 24px; padding-bottom: 2px;">
      课程照片
    </div>
    <div style="color: #70757a; font-size: 16px; font-weight: 400; line-height: 24px;">
      <slot name="subtitle">
      </slot>
    </div>
    <div style="color: rgba(0,0,0,.87); margin-bottom: 12px; margin-top: 12px;">
      <div id="button" style="align-items: center; background: transparent; border-radius: 9999px; border: 1px solid #dadce0; box-shadow: none; box-sizing: border-box; color: #3c4043; display: inline-flex; font-size: 14px; height: 36px; justify-content: center; margin-bottom: 6px; margin-top: 6px; min-width: 64px; padding: 0 16px 0 12px;">
        <div style="color: #1a73e8; height: 18px; margin-right: 8px; width: 18px; fill: currentColor;">
          <svg style="width: 100%; height: 100%;" viewBox="0 0 24 24" focusable="false" class="NMm5M">
            <path d="M20 10h-2V7h-3V5h3V2h2v3h3v2h-3v3zm-4 3c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zm4-1v7H4V7h9V3H9L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-7h-2z">
            </path>
          </svg>
        </div><span>添加照片
        </span>
      </div>
    </div>
    <!--display: none-->
    <div id="items" style="height: 96px; width: 100%; margin: 12px 0;display: none">
<!--      <div style="height: 100%; overflow-y: hidden; overflow-x: auto; white-space: nowrap;">-->
        <div id="images" style="display: flex;flex-wrap: wrap;gap: 8px;">
          <div class="button" style="padding: 0 23px 0 23px; border: 1px solid #dadce0; border-radius: 16px; margin:0 0 8px 0; width: 112px; height: 96px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #1a73e8; background: rgba(26,115,232,.04);">
            <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
              <path d="M9.797 14.016q0-1.359 0.938-2.297t2.25-0.938q1.359 0 2.297 0.938t0.938 2.297q0 1.313-0.938 2.25t-2.297 0.938-2.273-0.914-0.914-2.273zM12.984 18.984q2.063 0 3.539-1.453t1.477-3.516-1.477-3.539-3.539-1.477-3.516 1.477-1.453 3.539 1.453 3.516 3.516 1.453zM6 9.984v-3h3v-3h6.984l1.828 2.016h3.188q0.797 0 1.406 0.609t0.609 1.406v12q0 0.797-0.609 1.383t-1.406 0.586h-15.984q-0.797 0-1.406-0.586t-0.609-1.383v-10.031h3zM3 3.984v-3h2.016v3h3v2.016h-3v3h-2.016v-3h-3v-2.016h3z">
              </path>
            </svg>
          </div>
          
          
          
        </div>
<!--      </div>-->
    </div>
  
   `;
        }

        static style() {
            return `
        <style>
        </style>`;
        }

        createInput() {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = false;
            input.accept = 'image/*';
            input.style.position = 'fixed';
            input.style.left = '-100%';
            document.body.appendChild(input);
            return input;
        }

        appendImagePreview(src) {
            if (!src.startsWith('https://')) {
                src = `${this.host}/${src}`
            }
            const template = `<div style="position: relative; overflow: hidden; border: 1px solid #dadce0; border-radius: 16px; margin:0 0 8px 0; width: 112px; height: 96px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; fill: currentColor; color: #1a73e8; background: rgba(26,115,232,.04);">
            <div id="close" style="position: absolute; right: 8px; top: 8px; height: 32px; width: 32px; background: rgba(32,33,36,.6); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <svg style="width: 24px; height: 24px; fill: #fff;" viewBox="0 0 24 24">
                <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z">
                </path>
              </svg>
            </div>
            <img style="max-width: 100%; object-fit: contain;" src="${src}" />
          </div>`;
            const div = document.createElement('div');
            div.className = 'image'
            div.innerHTML = template;
            div.dataset.src = src;
            div.querySelector('#close').addEventListener('click', evt => {
                div.remove();
                this.dispatchEvent(new CustomEvent('remove', {
                    detail: src
                }));
            });
            if (parseInt(this.max) === 1) {
                this.root.querySelectorAll('.image')
                    .forEach(x => x.remove())
            }
            this.items.querySelector('#images').appendChild(div);
        }

        uploadImage() {
            const input = this.createInput();
            input.addEventListener('change', async evt => {
                const formData = createUploadData(input)
                const text = await uploadData(this.uri, formData);
                this.button.parentNode.style.display = 'none';
                this.items.style.display = 'block';
                this.appendImagePreview(text);
                this.dispatchEvent(new CustomEvent('upload', {
                    detail: [...this.root.querySelectorAll('.image')]
                        .map(x => x.dataset.src)
                }));
            })
            input.click();
        }
    }

    async function uploadData(uri, formData) {
        const res = await fetch(uri, {
            method: 'POST',
            body: formData
        });
        return await res.text();
    }

    function createUploadData(input) {
        const formData = new FormData();
        formData.append("images", input.files[0], input.files[0].name)
        return formData;
    }

    customElements.define('custom-uploader', CustomUploader);
    /*
    <!--
    <script src="uploader.js"></script>
    <custom-uploader></custom-uploader>
    const customCustomUploader = document.querySelector('custom-uploader');
    -->
    */
})()