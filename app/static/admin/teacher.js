let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : '';
;
let id = new URL(window.location).searchParams.get('id') || 1;
let _obj;

const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
    evt.stopPropagation();
    const res = await fetch(`${baseUri}/api/admin.teacher.insert`, {
        method: 'POST',
        body: JSON.stringify({
            id,
            thumbnail: substringAfterLast(evt.detail[0], '/')
        })
    });
    const obj = await res.text();
});
customUploader.addEventListener('remove', evt => {
    console.log(evt);
})

async function fetchAdminTeacherQuery() {
    const res = await fetch(`${baseUri}/api/admin.teacher.query?id=${id}`)
    const obj = await res.json();
    return obj;
}
const fieldName = document.querySelector('#field-name');
const fieldIntroduction = document.querySelector('#field-introduction');
const fieldDescription = document.querySelector('#field-description');
const fieldPhoneNumber = document.querySelector('#field-phone_number');

if (id)
    fetchAdminTeacherQuery().then(res => {
        console.log(res)
        _obj = res;
        fieldName.setAttribute('head', '姓名');
        fieldName.setAttribute('subhead', res.name);
        fieldIntroduction.setAttribute('head', '简介');
        fieldIntroduction.setAttribute('subhead', res.introduction.substring(0, 10));
        fieldDescription.setAttribute('head', '描述');
        fieldDescription.setAttribute('subhead', res.description.substring(0, 10));
        fieldPhoneNumber.setAttribute('head', '手机号码');
        fieldPhoneNumber.setAttribute('subhead', res.phone_number);

        if (res.thumbnail)
            customUploader.setAttribute('images', JSON.stringify([res.thumbnail]));
    });



fieldDescription.addEventListener('click', evt => {
    evt.stopPropagation();
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = _obj.description;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/admin.teacher.insert`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                description: textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
});
fieldName.addEventListener('click', evt => {
    evt.stopPropagation();
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = _obj.name;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/admin.teacher.insert`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                name: textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
});
fieldPhoneNumber.addEventListener('click', evt => {
    evt.stopPropagation();
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = _obj.phone_number;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/admin.teacher.insert`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                phone_number: textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
});
fieldIntroduction.addEventListener('click', evt => {
    evt.stopPropagation();
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = _obj.introduction;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/admin.teacher.insert`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                introduction: textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
});