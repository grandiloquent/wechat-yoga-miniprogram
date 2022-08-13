let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
let list = document.getElementById('list');
let startTime = new Date().setHours(0, 0, 0, 0) / 1000;
let endTime = startTime + 86400;
const customActions = document.querySelector('custom-actions');
customActions.setAttribute('items', JSON.stringify(["今天", "明天", "本周","下周"]));

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
    }else if (evt.detail === 3) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000 + 7 * 3600 * 24;
        endTime = new Date().setHours(0, 0, 0, 0) / 1000 + 14 * 3600 * 24;
    }
    render();
});
async function loadData() {

    const classType = 4;
    const response = await fetch(`${baseUri}/api/reservation.query.booked?startTime=${startTime}&endTime=${endTime}&classType=${classType}`);
    return response.json();
}

async function render() {
    list.innerHTML = '';
    try {
        const obj = await loadData();
        const g = groupByKey(obj, 'date_time');
        Object.keys(g).sort().reverse().forEach(key => {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                console.log(x);
                const div = document.createElement('div');
                
                div.innerHTML = `<div style="user-select: none;border-top: 1px solid #e8eaed; padding:12px 16px;position:relative ">
                <a style="position:absolute;left:0;top:0;right:0;bottom:0" href="/admin.booking?id=${x.course_id}"></a>
                <div style="display: flex;"><img style="width: 92px; height: 92px; margin-right: 16px; border-radius: 8px;"
                        src="https://static.lucidu.cn/images/${x.thumbnail}">
                    <div style="flex-grow: 1;">
                        <div style="color: #5f6368; font-size: 12px; line-height: 16px; display: flex; align-items: center;">
                            <div>${secondsToDuration(x.start_time)}-${secondsToDuration(x.end_time)}</div>
                        </div><a style="color: #202124; font-size: 16px; line-height: 24px; padding-top: 8px;text-decoration: none;"
                            >${x.lesson_name}</a>
                    </div>
                </div>
                <div style="display:flex;padding:8px 0 0 0">
                    <div style="flex-grow:1"></div>
                    <div style="color:rgb(112, 117, 122);font-size:12px;line-height:16px">已预约 ${x.total}/${x.peoples} 人</div>
                </div>
            </div>`;
                customItemHeader.appendChild(div);
                
            });
            list.insertAdjacentElement('afterbegin', customItemHeader);
        })

    } catch (error) {
        console.log(error)
        document.getElementById('toast').setAttribute('message', error);
    }
}

render();
