let _obj = {};
let baseUri = 'http://localhost:8080';
let id = new URL(window.location).searchParams.get('id');

async function fetchData() {
    const res = await fetch(`${baseUri}/api/card?mode=2&id=${id}`)
    const obj = await res.json();
    return obj;
}

if (id)
    fetchData().then(res => {
        _obj = res;
        fieldTitle.querySelector('span').textContent = res.title;
        fieldDescription.querySelector('span').textContent = res.description;
        fieldPrice.querySelector('span').textContent = res.price;
    });

const fieldTitle = document.querySelector('#field-title');
fieldTitle.addEventListener('click', evt => {
    evt.stopPropagation();
    updateValue('title');
});
const fieldPrice = document.querySelector('#field-price');
fieldPrice.addEventListener('click', evt => {
    evt.stopPropagation();
    updateValue('price', true);
});
const fieldDescription = document.querySelector('#field-description');
fieldDescription.addEventListener('click', evt => {
    evt.stopPropagation();
    updateValue('description');
});

function updateValue(key, isNumber) {
    const customInput = document.createElement('custom-input');
    const textarea = document.createElement('textarea');
    customInput.appendChild(textarea);
    document.body.appendChild(customInput);
    textarea.value = _obj[key] || '';
    textarea.focus();
    customInput.addEventListener('submit', async evt => {
        const res = await fetch(`${baseUri}/api/card`, {
            method: 'POST',
            body: JSON.stringify({
                id: _obj.id || 0,
                [key]: isNumber ? parseInt(textarea.value) : textarea.value
            })
        });
        const obj = await res.text();
        console.log(obj);
    })
}