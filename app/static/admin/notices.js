let baseUri = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '';

async function loadData() {
    const response = await fetch(`${baseUri}/api/notice?mode=1`);
    return response.json();
}

async function render() {
    let obj;
    try {
        obj = await loadData();
        console.log(obj);
        const fragment = document.createDocumentFragment();
        obj.forEach(x => {
            const item = createNoticeItem(x);
            item.addEventListener('click', evt => {
                evt.stopPropagation();
                window.location = `./admin.notice?id=${x.id}`;
            });
            fragment.appendChild(item);
        });
        document.querySelector('.items').appendChild(fragment);
    } catch (e) {
        document.getElementById('toast').setAttribute('message', e.message);
    }
}

render();

function createNoticeItem(x) {
    const item = document.createElement('div');
    item.dataset.id = x.id;
    item.setAttribute("class", "item");
    const itemText = document.createElement('span');
    itemText.setAttribute("class", "item-text");
    item.appendChild(itemText);
    itemText.textContent = x.title;
    const itemSubtitle = document.createElement('div');
    itemSubtitle.setAttribute("class", "item-subtitle");
    item.appendChild(itemSubtitle);
    const t = new Date(x.updated_time * 1000);
    itemSubtitle.textContent = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${(t.getDate()).toString().padStart(2, '0')}`;
    return item;
}