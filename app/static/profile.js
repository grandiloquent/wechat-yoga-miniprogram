let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = parseInt(new URL(window.location).searchParams.get('id') || getCookie('UserId'));
let obj;

async function loadData() {
    const response = await fetch(`${baseUri}/api/user.query?id=${id}`);
    return response.json();
}

async function render() {
    try {
        obj = await loadData();
        console.log(obj)
        // address
        document.querySelector('#field-name span').textContent = obj.nick_name || '未设置';
        document.querySelector('#field-address span').textContent = obj.address || '未设置';
        document.querySelector('#field-gender span').textContent = (obj.gender === 1 && '男') ||(obj.gender === 2 && '女') || '未设置';
        document.querySelector('#field-phone span').textContent = obj.phone || '未设置';
        customUploader.setAttribute('title', '用户头像');
        customUploader.setAttribute('images', JSON.stringify([obj.avatar_url]));
    } catch (e) {
        console.log(e)
        document.getElementById('toast').setAttribute('message', '成功');
    }
}

render();


const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
    evt.stopPropagation();
    const res = await fetch(`${baseUri}/api/user`, {
        method: 'POST',
        body: JSON.stringify({
            id: id,
            avatar_url: evt.detail[0]
        })
    });
    const obj = await res.text();
});

const fieldName = document.querySelector('#field-name');

fieldName.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = obj.nick_name;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                name: textarea.value
            })
        });
        obj.nick_name = textarea.value;
    })
});

const fieldAddress = document.querySelector('#field-address');

fieldAddress.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = obj.address;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                address: textarea.value
            })
        });
        obj.address = textarea.value;
    })
});


const fieldGender = document.querySelector('#field-gender');

fieldGender.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value =(obj.gender === 1 && '男') ||(obj.gender === 2 && '女') || '未设置';
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/user`, {
            method: 'POST',
            body: JSON.stringify({
                id: id,
                gender: (textarea.value.indexOf('男') !== -1 && 1) || (textarea.value.indexOf('女') !== -1 && 2) || 0
            })
        });
        obj.gender = textarea.value;
    })
});
