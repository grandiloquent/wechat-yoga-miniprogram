let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : '';


const fieldCloseBook = document.querySelector('#field-close_book');
const fieldCloseBooked = document.querySelector('#field-close_booked');

render();

//
// if (id)
//     fetchSettings().then(res => {
//         console.log(res)
//         _obj = res;
//         fieldName.setAttribute('head', '姓名');
//         fieldName.setAttribute('subhead', res.name);
//         fieldIntroduction.setAttribute('head', '简介');
//         fieldIntroduction.setAttribute('subhead', res.introduction.substring(0, 10));
//         fieldDescription.setAttribute('head', '描述');
//         fieldDescription.setAttribute('subhead', res.description.substring(0, 10));
//         fieldPhoneNumber.setAttribute('head', '手机号码');
//         fieldPhoneNumber.setAttribute('subhead', res.phone_number);
//
//         if (res.thumbnail)
//             customUploader.setAttribute('images', JSON.stringify([res.thumbnail]));
//     });


async function fetchSettings() {
    const res = await fetch(`${baseUri}/api/configs`)
    return res.json();
}

// /api/admin.teacher.insert
async function launchEditor(key, value, uri) {
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = value;
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}${uri}`, {
            method: 'POST',
            body: JSON.stringify({
                id,
                [key]: textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
}


async function render() {
    const response = await fetchSettings();

    fieldCloseBook.setAttribute('subhead', `${response.close_book}分钟`);

    fieldCloseBook.addEventListener('click', evt => {
        launchEditor('close_book', response.close_book, `${baseUri}/api/admin.configs.insert`)
    });

    fieldCloseBooked.setAttribute('subhead', `${response.close_booked}分钟`);
    fieldCloseBooked.addEventListener('click', evt => {
        launchEditor('close_booked', response.close_booked, `${baseUri}/api/admin.configs.insert`)
    });


}
