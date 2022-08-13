let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id') || 1;
let userId = new URL(window.location).searchParams.get('userId') || getCookie("UserId");

let items = document.getElementById('items');
const thumbnail = document.querySelector('#thumbnail');
const teacherName = document.querySelector('#teacher-name');
const introduction = document.querySelector('#introduction');
const introductionButton = document.querySelector('#introduction-button');
const phoneButton = document.querySelector('#phone-button');

async function loadData() {
    const startTime = new Date().setHours(0, 0, 0, 0) / 1000;
    const endTime = 86400 * 7 + startTime;
    const response = await fetch(`${baseUri}/api/reservation?mode=10&id=${id}&userId=${userId}&startTime=${startTime}&endTime=${endTime}&classType=4`);
    return response.json();
}


async function render() {
    items.innerHTML = '';
    try {
        const obj = await loadData();
        console.log(obj)
        // empty.style.display = 'none';introduction

        introductionButton.setAttribute('href', `/introduction?id=${id}`);
        phoneButton.setAttribute('href', `tel:${obj.teacher.phone_number || '15348313821'}`)

        thumbnail.setAttribute('src', `https://static.lucidu.cn/images/${obj.teacher.thumbnail}`);
        teacherName.textContent = obj.teacher.name;
        document.title = obj.teacher.name
        introduction.textContent = obj.teacher.introduction;

        const g = groupByKey(obj.lessons, 'date_time');

        Object.keys(g).sort().reverse().forEach(key => {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                const customItem = document.createElement('custom-item');
                customItem.setAttribute('data', JSON.stringify(x));
                customItem.addEventListener('touch', async evt => {
                    await executeBooking(customItem, evt);
                    await executeUnBooking(customItem, evt);
                })
                customItemHeader.appendChild(customItem);
            });
            items.insertAdjacentElement('afterbegin', customItemHeader);
        })
    } catch (e) {
        //empty.style.display = 'flex';
        console.log(e);
    }
}

render();


async function executeBooking(element, evt) {
    if (evt.detail.mode === 1) {
        try {
            await booking(evt.detail.course_id, userId);
            await updateItem(element, evt);
        } catch (e) {
            console.log(e)
            document.getElementById('toast').setAttribute('message', '无法预约');
        }
    }
}

async function updateItem(element, evt) {
    const x = await queryBooking(evt.detail.course_id, userId);
    const customItem = document.createElement('custom-item');
    customItem.setAttribute('data', x);
    customItem.addEventListener('touch', async evt => {
        await executeBooking(customItem,evt);
        await executeUnBooking(customItem, evt);
    });
    element.replaceWith(customItem);
}

function executeUnBooking(element, evt) {
    if (evt.detail.mode === 2) {
        const customDialog = document.createElement('custom-dialog');
        const div = document.createElement('div');
        div.textContent = '您确定要取消预约吗？'
        customDialog.appendChild(div);
        customDialog.addEventListener('submit', async ev => {
            try {
                await unBooking(evt.detail.reservation_id);
                await updateItem(element, evt);
            } catch (e) {
                document.getElementById('toast').setAttribute('message', '无法预约');
            }
        })
        document.body.appendChild(customDialog);

    }
}


