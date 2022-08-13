async function fetchData() {
    const id = new URL(window.location).searchParams.get('id');
    const response = await fetch(`/api/notice?mode=2&id=${id}`);
    return response.json();
}

async function render() {
    const obj = await fetchData();
    document.getElementById('title')
        .textContent = obj.title;
    const t = new Date(obj.updated_time * 1000)
    document.getElementById('subtitle').textContent = `发布于${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日`;

    var md = window.markdownit();
    document.getElementById('content').innerHTML = md.render(obj.content);
}

render();