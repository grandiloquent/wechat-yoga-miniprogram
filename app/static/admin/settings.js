let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:8080' : '';


const fieldCloseBook = document.querySelector('#field-close_book');
const fieldCloseBooked = document.querySelector('#field-close_booked');
const fieldMarketSlogan = document.querySelector('#field-market_slogan');
const fieldMarketContent = document.querySelector('#field-market_content');


render();

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
        console.log(JSON.stringify({
            [key]: textarea.value
        }));
        const res = await fetch(`${baseUri}${uri}`, {
            method: 'POST',
            body: JSON.stringify({
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
        launchEditor('close_book', response.close_book, `/api/admin.config.insert`)
    });

    fieldCloseBooked.setAttribute('subhead', `${response.close_booked}分钟`);
    fieldCloseBooked.addEventListener('click', evt => {
        launchEditor('close_booked', response.close_booked, `/api/admin.config.insert`)
    });
    fieldMarketSlogan.setAttribute('subhead', `${response.market.slogan}`);
    fieldMarketSlogan.addEventListener('click', evt => {
        launchEditor('market_slogan', response.market.slogan, `/api/admin.config.insert`)
    });
    fieldMarketContent.addEventListener('click', evt => {
        window.location='/admin.market'
    }); 

}
