let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
const suspend = document.querySelector('#suspend');
const edit = document.querySelector('#edit');
const qr = document.querySelector('#qr');
const section = document.querySelector('.section');
const backButton = document.querySelector('.back-button');
backButton.addEventListener('click', evt => {
    history.back();
})



async function loadData() {
    const response = await fetch(`${baseUri}/api/user.booking?id=${id}`);
    return response.json();
}
const h1 = document.querySelector('.h1');


async function render() {
    let obj;
    try {
        obj = await loadData();

        h1.textContent = obj.user.name || obj.user.nick_name;
        document.querySelector('.top img').setAttribute('src', obj.user.avatar_url);
        document.querySelector('.h2').textContent = `${obj.user.phone || '153****3821'}`;
        if (obj.lesson) {
            obj.lesson.sort((x, y) => {
                const dif = - y.date_time - x.date_time;
                if (dif !== 0) {
                    return dif;
                }
                return y.start_time - x.start_time;
            }).forEach(x => {

                const template = `<div data-id=${x.id} style="border-bottom: 1px solid #e5e5e5; padding: 12px 0; display: flex; flex-direction: row;">
                <img src="https://static.lucidu.cn/images/${x.thumbnail}" style="width: 48px; height: 48px; border-radius: 8px; margin-right: 12px;" />
                <div style="font-size: 14px; flex-grow: 1;">
                    <div>${x.lesson_name}</div>
                    <div style="font-size:12px;color:rgba(3,3,3,.6);margin-top:4px">${getShortDateString(x.date_time)} • ${secondsToDuration(x.start_time)}-${secondsToDuration(x.end_time)}</div>
                </div>
                <div class="more_vert" data-id=${x.id} 
                    style="display: inline-block; flex-shrink: 0; width: 48px; height: 48px; fill: currentColor; stroke: none; padding: 12px; box-sizing: border-box; color: #030303;">
                    
                </div>
            </div>`;
                section.insertAdjacentHTML('afterbegin', template);

                /*<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                                        <path
                                            d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z">
                                        </path>
                                    </svg>*/
            });
            setMoreMenu();
        } else {
            insertEmptyViewer();
        }
    } catch (e) {
        document.getElementById('toast').setAttribute('message', '无法加载。');
    }
}


render();

edit.addEventListener('click', evt => {
    // Edit User Information with User ID
    window.location = `/admin.user.edit?id=${id}`;
});

suspend.addEventListener('click', evt => {
    window.location = `/admin.vipCard?id=${id}`;
});



qr.addEventListener('click', evt => {


})


function insertEmptyViewer() {
    const customEmptyViewer = document.createElement('custom-empty-viewer');
    customEmptyViewer.setAttribute('text', '未找到相关课程');
    document.body.appendChild(customEmptyViewer);
}
function setMoreMenu() {
    const moreVerts = document.querySelectorAll('.more_vert');
    moreVerts.forEach(moreVert => {
        moreVert.addEventListener('click', evt => {
            const customModalMenu = document.createElement('custom-modal-menu');
            document.body.appendChild(customModalMenu);
        })
    })
}