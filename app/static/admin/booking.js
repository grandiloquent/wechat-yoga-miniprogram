let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
const suspend = document.querySelector('#suspend');
const edit = document.querySelector('#edit');
const qr = document.querySelector('#qr');
const section = document.querySelector('.section');



async function loadData() {
    const response = await fetch(`${baseUri}/api/reservation.query.booked.users?id=${id}`);
    return response.json();
}
const h1 = document.querySelector('.h1');


async function render() {
    let obj;
    try {
        obj = await loadData();
        if (obj.lesson.hidden) {
            const actionText = suspend.querySelector('.action-text');
            actionText.textContent = '已停课';
            suspend.classList.add('disabled');
            edit.classList.add('disabled');
            qr.classList.add('disabled');
        }
        h1.textContent = obj.lesson.lesson_name;
        document.querySelector('.top img').setAttribute('src', `http://static.lucidu.cn/images/${obj.lesson.thumbnail}`);
        document.querySelector('.h2').textContent = `${getShortDateString(obj.lesson.date_time)} ${secondsToDuration(obj.lesson.start_time)}-${secondsToDuration(obj.lesson.end_time)}`;

        obj.users.forEach(x => {
            const template = `<div data-id=${x.id} style="border-bottom: 1px solid #e5e5e5; padding: 12px 0; display: flex; flex-direction: row;">
            <img src="${x.avatar_url}" style="width: 48px; height: 48px; border-radius: 8px; margin-right: 12px;" />
            <div style="font-size: 14px; flex-grow: 1;">
                ${x.nick_name}
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
            section.insertAdjacentHTML('afterbegin', template);
            

        });
        const moreVerts = document.querySelectorAll('.more_vert');
        moreVerts.forEach(moreVert => {
            moreVert.addEventListener('click', evt => {
                const customModalMenu = document.createElement('custom-modal-menu');
                document.body.appendChild(customModalMenu);
            })
        })

        //  document.querySelector('.section img').setAttribute('src', obj.users[0].avatar_url);


    } catch (e) {
        console.log(e)
        document.getElementById('toast').setAttribute('message', '无法加载。');
    }
}

render();



suspend.addEventListener('click', evt => {
    if (suspend.classList.contains('disabled')) {
        const customDialog = document.createElement('custom-dialog');
        const div = document.createElement('div');
        div.textContent = '您确定要重启此吗？';
        customDialog.appendChild(div);
        customDialog.addEventListener('submit', async evt => {
            try {
                await restartLesson();
                window.location.reload();
            } catch (error) {
            }
        })
        document.body.appendChild(customDialog);
    }
    else {
        const customDialog = document.createElement('custom-dialog');
        const div = document.createElement('div');
        div.textContent = '您确定要停课吗？';
        customDialog.appendChild(div);
        customDialog.addEventListener('submit', async evt => {
            try {
                await suspendLesson();
                window.location.reload();
            } catch (error) {
            }
        })
        document.body.appendChild(customDialog);
    }
});



async function suspendLesson() {
    const res = await fetch(`${baseUri}/api/reservation.suspend?id=${id}`);
}
async function restartLesson() {
    const res = await fetch(`${baseUri}/api/reservation.restart?id=${id}`);
}

qr.addEventListener('click', evt => {
    if (qr.classList.contains('disabled')) {
        return;
    }
    const customDialog = document.createElement('custom-dialog');
    const img = document.createElement('img');
    img.style.width = '100%';
    customDialog.appendChild(img);
    new AwesomeQR.AwesomeQR({
        text: `$id=${id}&t=${new Date()}`,
        size: 250,
    }).draw().then((dataURL) => {
        img.src = dataURL;
    });
    customDialog.addEventListener('submit', async evt => {
        try {
            await suspendLesson();
            window.location.reload();
        } catch (error) {
        }
    })
    document.body.appendChild(customDialog);

})
