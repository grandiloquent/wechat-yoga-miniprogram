let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
const id = new URL(window.location).searchParams.get('id') || 1;
async function fetchData() {
    const response = await fetch(`${baseUri}/api/teacher?mode=1&id=${id}`);
    return response.json();
}

async function render() {
    const obj = await fetchData();
    document.getElementById('title')
        .textContent = obj.name;
    const t = new Date(obj.updated_time * 1000)
    document.getElementById('subtitle').textContent = `发布于${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;

    var md = window.markdownit();
    document.getElementById('content').innerHTML = md.render(obj.description);
}

render();