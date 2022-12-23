const customHeader = document.querySelector('custom-header');
customHeader.setAttribute('title', "管理员");
[...document.querySelectorAll('[data-href]')]
    .forEach(x => {
        x.addEventListener('click', evt => {
            window.location = evt.currentTarget.dataset.href;
        });
    })

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id') || 1;

async function loadData() {
    const response = await fetch(`${baseUri}/v1/admin/notice?id=${id}`, {
        headers: {
            "Authorization": window.localStorage.getItem("Authorization")
        }
    })
    return response.json();
}
const title = document.querySelector('.title');
const content = document.querySelector('.content');
const submit = document.querySelector('.submit');
submit.addEventListener('submit', async evt => {
    evt.stopPropagation();
    const data = {};
    data.id = id;
    data.title = title.value.trim();
    data.content = content.value.trim();
    try {
        const response = await fetch(`${baseUri}/v1/admin/notice/update`, {
            method: 'POST',
            headers: {
                "Authorization": window.localStorage.getItem("Authorization")
            },
            body: JSON.stringify(data)
        });
         await response.text();
         document.getElementById('toast').setAttribute('message','成功');
    } catch (error) {
        console.log(error);
        document.getElementById('toast').setAttribute('message','失败');
    }
});

async function render() {
    let obj;
    try {
        obj = await loadData();
        title.value = obj.title;
        content.value = obj.content;

    } catch (error) {

    }
}
render();