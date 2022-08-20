let baseUri = getBaseUri();

let id = new URL(window.location).searchParams.get('id');

const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
    evt.stopPropagation();
    const res = await fetch(`${baseUri}/api/admin.lesson.insert`, {
        method: 'POST',
        body: JSON.stringify({
            id,
            image: substringAfterLast(evt.detail[0], '/')
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
    const res = await fetch(`${baseUri}/api/admin.lesson.insert`, {
        method: 'POST',
        body: JSON.stringify({
            id,
            photos: evt.detail.map(x => substringAfterLast(x, '/'))
        })
    });
    const obj = await res.text();
});


if (id) {
    fetchData().then(res => {
        updateTitle(res);
        renderLessonName(res);
        renderDescription(res);
        if (res.image)
            customUploader.setAttribute('images', JSON.stringify([res.image]));
        uploader.setAttribute('images', JSON.stringify(res.photos));
    });
} else {
    bindLessonName()
    bindDescription();
}


function updateTitle(res) {
    document.title = `${res.name} - 更新课程`
}

function renderLessonName(res) {
    document.querySelector('#field-name')
        .setAttribute('subhead', res.name);
    bindLessonName(res);
}

function bindLessonName(res) {
    document.querySelector('#field-name').addEventListener('click', evt => {
        launchTextarea(res ? res.name : '', `${baseUri}/api/admin.lesson.insert`, data => {
            return {
                id,
                name: data
            }
        }, (v) => {
            if (id)
                window.location.reload();
            else if (v) {
                window.location = `${window.location.origin}${window.location.pathname}?id=${v}`
            }
        })
    })
}

function renderDescription(res) {
    document.querySelector('#field-description')
        .setAttribute('subhead', res.description.length > 10
            ? res.description.substring(0, 10) : res.description);
    bindDescription(res);
}

function bindDescription(res) {
    document.querySelector('#field-description').addEventListener('click', evt => {
        launchTextarea(res ? res.description : '', `${baseUri}/api/admin.lesson.insert`, data => {
            return {
                id,
                description: data
            }
        }, (v) => {
            if (id)
                window.location.reload();
            else if (v) {
                window.location = `${window.location.origin}${window.location.pathname}?id=${v}`
            }
        })
    })
}

async function fetchData() {
    const res = await fetch(`${baseUri}/api/lesson.query.detail?id=${id}`)
    return await res.json();
}