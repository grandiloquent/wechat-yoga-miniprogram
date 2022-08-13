let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
let id = new URL(window.location).searchParams.get('id') || 30;
let _obj;

const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
    evt.stopPropagation();
    const res = await fetch(`${baseUri}/api/lesson`, {
        method: 'POST',
        body: JSON.stringify({
            id,
            image: substringAfterLast(evt.detail[0],'/')
        })
    });
    const obj = await res.text();
});
customUploader.addEventListener('remove', evt => {
    console.log(evt);
})
const uploader = document.querySelector('#uploader');



uploader.addEventListener('upload', async evt => {
    evt.stopPropagation();
    const res = await fetch(`${baseUri}/api/lesson`, {
        method: 'POST',
        body: JSON.stringify({
            id,
            photos: evt.detail.map(x=>substringAfterLast(x,'/'))
        })
    });
    const obj = await res.text();
});

async function fetchData() {
    const res = await fetch(`${baseUri}/api/lesson.query.detail?id=${id}`)
    const obj = await res.json();
    return obj;
}

if (id)
    fetchData().then(res => {
        _obj = res;
        document.querySelector('#field-name span')
            .textContent = res.name;
        fieldDescription.querySelector('span').textContent = res.description;
        if (res.image)
            customUploader.setAttribute('images', JSON.stringify([res.image]));
        uploader.setAttribute('images', JSON.stringify(res.photos));
    });


const fieldDescription = document.querySelector('#field-description');

fieldDescription.addEventListener('click', evt => {
    evt.stopPropagation();

    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = _obj.description;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/lesson`, {
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
