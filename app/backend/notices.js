const customHeader = document.querySelector('custom-header');
customHeader.setAttribute('title', "管理员");
[...document.querySelectorAll('[data-href]')]
    .forEach(x => {
        x.addEventListener('click', evt => {
            window.location = evt.currentTarget.dataset.href;
        });
    });

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
    const response = await fetch(`${baseUri}/v1/admin/notices`, {
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
            div.addEventListener('click', evt => {
                evt.stopPropagation();
            });
            div.className = "item";
            appendChild(div,value.title,"item-title");
            wrapper.appendChild(div);
        })
    } catch (error) {

    }
}
render();
function appendChild(parent, textContent, className) {
    const div = document.createElement('div');
    className && (div.className = className);
    textContent && (div.textContent = textContent);
    parent.appendChild(div);
    return div;
}