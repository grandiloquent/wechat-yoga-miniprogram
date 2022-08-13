let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
const section = document.querySelector('.section');

async function loadData() {
    const response = await fetch(`${baseUri}/api/lessons.query`);
    return response.json();
}
function createLessonItem(x) {
    const image = x.image ? `https://static.lucidu.cn/images/${x.image}` : x.image;

    return `<div data-id=${x.id} style="border-bottom: 1px solid #e5e5e5; padding: 12px 0; display: flex; flex-direction: row;">
            <img src="${image}" style="width: 48px; height: 48px; border-radius: 8px; margin-right: 12px;" />
            <div style="font-size: 14px; flex-grow: 1;">
                ${x.name}
            </div>
            <div class="more_vert" data-id=${x.id} 
                style="display: inline-block; flex-shrink: 0; width: 48px; height: 48px; fill: currentColor; stroke: none; padding: 12px; box-sizing: border-box; color: #030303;">
                <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                    <path
                        d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z">
                    </path>
                </svg>
            </div>
        </div>`;
}
async function render() {
    let obj;
    try {
        obj = await loadData();
        console.log(obj)
        obj.forEach(x => {
            section.insertAdjacentHTML('afterbegin', createLessonItem(x));
        });
        const items = section.querySelectorAll('[data-id]');
        items.forEach((item, index) => {
            item.addEventListener('click', evt => {
                evt.stopPropagation();
                window.location = `./admin.lesson?id=${evt.currentTarget.dataset.id}`
            });
        });


    } catch (e) {
        console.log(e)
        document.getElementById('toast').setAttribute('message', '成功');
    }
}

render();

