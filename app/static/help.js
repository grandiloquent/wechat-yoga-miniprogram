const customStickyHeader = document.querySelector('custom-sticky-header');
const wrapper = document.querySelector('.wrapper');
let scrollTop = 0;
wrapper.addEventListener('scroll', evt => {
    if (scrollTop > wrapper.scrollTop) {
        customStickyHeader.setAttribute('active', '')
    } else {
        customStickyHeader.setAttribute('inactive', '')
    }
    scrollTop = wrapper.scrollTop;
})

let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');

async function loadData() {
    const response = await fetch(`${baseUri}/api/help`);
    return response.json();
}

async function render() {
    const obj = await loadData();
    document.getElementById('title')
        .textContent = obj.title;
    const t = new Date(obj.updated_time * 1000)
    document.getElementById('subtitle').textContent = `发布于${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;

    var md = window.markdownit();
    document.getElementById('content').innerHTML = md.render(obj.content);
}

render();