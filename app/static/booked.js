let baseUri = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '';

let startTime = new Date().setHours(0, 0, 0, 0) / 1000;
let endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 1 * 3600 * 24;
let userId = new URL(window.location).searchParams.get('userId') || getCookie('UserId');
let list = document.getElementById('list');
let expandable = document.getElementById('expandable');

const leftText = document.querySelector('#left .text');
const weeks = '日一二三四五六'.split('');


initialize();


const customActions = document.querySelector('custom-actions');
customActions.setAttribute('items', JSON.stringify(["今天", "明天", "一周内"]));

customActions.addEventListener('touch', evt => {
    if (evt.detail === 0) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 1 * 3600 * 24;
    } else if (evt.detail === 1) {
        startTime = endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 1 * 3600 * 24;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 2 * 3600 * 24;
    } else if (evt.detail === 2) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 7 * 3600 * 24;
    }
    render();
});

const customExpandable = document.querySelector('custom-expandable');

let height = 0;
expandable.style.height = 0;

const items = [...document.querySelectorAll('.item')]

customExpandable.addEventListener('expand', evt => {
    if (evt.detail === '0') {
        expandable.style.height = 0;
        items.forEach(x => x.style.visibility = 'hidden')
    } else {
        items.forEach(x => x.style.visibility = 'visible')
        expandable.style.height = `${height}px`;

    }
})

render();

//------------------------------------------------------

async function loadData(startTime, endTime, userId) {
    const response = await fetch(`${baseUri}/api/reservation.query.user?startTime=${startTime}&endTime=${endTime}&userId=${userId}&classType=4`);
    return response.json();
}

async function render() {
    list.innerHTML = '';
    try {
        const obj = await loadData(startTime, endTime, userId);
        const g = groupByKey(obj, 'date_time');
        Object.keys(g).sort().reverse().forEach(key => {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                const customItem = document.createElement('custom-item');
                customItem.setAttribute('data', JSON.stringify(x));
                customItem.addEventListener('touch', async evt => {

                    await executeUnBooking(customItem, evt);
                })
                customItemHeader.appendChild(customItem);
            });
            list.insertAdjacentElement('afterbegin', customItemHeader);
        })

    } catch (error) {
        const customEmptyViewer = document.createElement('custom-empty-viewer');
        customEmptyViewer.setAttribute('text', '未找到相关课程');
        customEmptyViewer.setAttribute('label', '预约课程');
        customEmptyViewer.addEventListener('submit',evt=>{
            window.location='/appointment';
        })
        list.appendChild(customEmptyViewer);
      
    }
}

function initialize() {
    const now = new Date();
    leftText.textContent = `${now.getMonth() + 1}月${now.getDate()}日周${weeks[now.getDay()]}`;
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
                if (element.parentNode.querySelectorAll('custom-item').length > 1) {
                    element.remove();
                } else {
                    element.parentNode.remove();
                }
            } catch (e) {
                document.getElementById('toast').setAttribute('message', '无法预约');
            }
        })
        document.body.appendChild(customDialog);

    }
}