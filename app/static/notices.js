let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';

const id = new URL(window.location).searchParams.get('id');

async function loadData() {
    const response = await fetch(`${baseUri}/api/notice?mode=1`);
    return response.json();
}

async function render() {
    let obj;
    try {
        obj = await loadData();
        console.log(obj)
        const fragment = document.createDocumentFragment();
        obj.forEach(x => {
            const item = document.createElement('a');
            item.href = `/notice?id=${x.id}`
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
            fragment.appendChild(item);
        });
        document.getElementById('items').appendChild(fragment);
    } catch (e) {
        document.getElementById('toast').setAttribute('message', '成功');
    }
}

render();
