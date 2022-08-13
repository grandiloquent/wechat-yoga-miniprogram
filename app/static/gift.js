let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
const id = new URL(window.location).searchParams.get('id') || 1;

async function loadData() {
    const response = await fetch(`${baseUri}/api/configs`);
    return response.json();
}

async function render() {
    let obj;
    try {
        obj = await loadData();
        document.getElementById('title').textContent = obj.market.title;
        var md = window.markdownit();
        document.getElementById('content').innerHTML = md.render(obj.market.content);
    } catch (e) {
        document.getElementById('toast').setAttribute('message', e);
    }
}

render();



 


