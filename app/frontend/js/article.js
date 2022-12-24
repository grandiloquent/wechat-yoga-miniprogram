function renderMarkdown(obj) {
  wrapper.innerHTML = markdownit({
    html: true,
    linkify: true,
    typographer: true
  }).render(obj);
}
const wrapper = document.querySelector('.markdown');
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const name = new URL(document.URL).searchParams.get('name') || '免费科学上网';
document.title = `${name} - ${document.title}`
async function loadData() {
  const response = await fetch(`${baseUri}/v1/document?name=${encodeURIComponent(name)}`)
  return response.text();
}
async function render() {

  let obj;
  try {
    obj = await loadData();
    renderMarkdown(obj);
    appendCopy();
  } catch (error) {
    console.log(error);
  }
}
render();

function appendCopy() {
  document.querySelectorAll('pre').forEach((element, index) => {
    const div = document.createElement('div');
    div.style = "display:flex;align-items: center;justify-content: center;width:24px;height:24px;position:absolute;right:0;top:0;"
    const text = `<svg style="width:18px;height:18px;fill:currentcolor;color:rgb(32, 33, 36);" viewBox="0 0 24 24">
<path d="M18.984 21v-14.016h-10.969v14.016h10.969zM18.984 5.016q0.797 0 1.406 0.586t0.609 1.383v14.016q0 0.797-0.609 1.406t-1.406 0.609h-10.969q-0.797 0-1.406-0.609t-0.609-1.406v-14.016q0-0.797 0.609-1.383t1.406-0.586h10.969zM15.984 0.984v2.016h-12v14.016h-1.969v-14.016q0-0.797 0.586-1.406t1.383-0.609h12z"></path>
</svg>`;
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML
    div.insertAdjacentHTML("afterbegin", text);
    element.appendChild(div);
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
    div.addEventListener('click', async evt => {
      evt.stopPropagation();
      let string;
      if (typeof NativeAndroid !== 'undefined') {
        string = NativeAndroid.writeText(element.textContent)
      } else {
        string = await navigator.clipboard.writeText(element.textContent)
      }
    });
  });
}
