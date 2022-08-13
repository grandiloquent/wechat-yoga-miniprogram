const customStickyHeader = document.querySelector('custom-sticky-header');
let scrollTop = 0;
const wrapper = document.body;
window.addEventListener('scroll', evt => {
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
let obj, teachers, lessons;
const customSubmitBar = document.querySelector('custom-submit-bar');

const lessonName = document.querySelector('.lesson_name');
lessonName.addEventListener('click', evt => {
    initializeLesson();
})
// const dateTime = document.querySelector('.date_time');
// dateTime.addEventListener('click', evt => {
//     initializeDate()
// })

const peoples = document.querySelector('.peoples');
peoples.addEventListener('click', evt => {
    initializePeoples();
})

const startTime = document.querySelector('.start_time');
startTime.addEventListener('click', evt => {
    initializeStartTime();
})
const endTime = document.querySelector('.end_time');
endTime.addEventListener('click', evt => {
    initializeEndTime();
})

async function getLessons() {
    const response = await fetch(`${baseUri}/api/cards.query`)
    return response.json();
}

async function initializeLesson() {

    if (!lessons) {
        lessons = await getLessons();
    }
    console.log(lessons)
    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        lessonName.setAttribute('value', evt.detail);
        const t = new Date();
        const dateString = `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;
        startTime.setAttribute('value', dateString)
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择会员卡')
    const names = lessons.map(x => x.title);
    customOptions.populateData(names, lessonName.value);
}

async function initializeStartTime() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);
    customSelect.innerHTML = `<div style="display: grid;grid-template-columns: repeat(3,1fr);">
    <custom-picker mode="1"></custom-picker>
    <custom-picker mode="2"></custom-picker>
    <custom-picker mode="3" month="8"></custom-picker>
</div>
<div style="display:flex;align-items: center;justify-content: center;">
    <div style="flex-grow: 1;"></div>
    <button style="font-size: 14px;padding: 0 24px;height: 32px;border-radius: 16px;border: none;background-color: rgb(26, 115, 232);margin: 16px 16px;color: #fff;">确认</button>
</div>`
    customSelect.setAttribute('title', '选择生效日期')
    const customPicker1 = customSelect.querySelector('[mode="1"]');
    const customPicker2 = customSelect.querySelector('[mode="2"]');
    const customPicker3 = customSelect.querySelector('[mode="3"]');
    const m = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(startTime.value);
    if (m) {
        customPicker1.setAttribute('start', parseInt(m[1]));
        customPicker2.setAttribute('start', parseInt(m[2]))
        customPicker3.setAttribute('start', parseInt(m[3]))

    }
    const button = customSelect.querySelector('button');
    button.addEventListener('click', evt => {
        startTime.setAttribute('value', `${customPicker1.value}年${customPicker2.value}月${customPicker3.value}日`);
        customSelect.remove();
    })




}
async function initializeEndTime() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);
    customSelect.innerHTML = `<div style="display: grid;grid-template-columns: repeat(3,1fr);">
    <custom-picker mode="1"></custom-picker>
    <custom-picker mode="2"></custom-picker>
    <custom-picker mode="3" month="8"></custom-picker>
</div>
<div style="display:flex;align-items: center;justify-content: center;">
    <div style="flex-grow: 1;"></div>
    <button style="font-size: 14px;padding: 0 24px;height: 32px;border-radius: 16px;border: none;background-color: rgb(26, 115, 232);margin: 16px 16px;color: #fff;">确认</button>
</div>`
    customSelect.setAttribute('title', '选择生效日期')
    const customPicker1 = customSelect.querySelector('[mode="1"]');
    const customPicker2 = customSelect.querySelector('[mode="2"]');
    const customPicker3 = customSelect.querySelector('[mode="3"]');
    const m = /(\d{4})年(\d{1,2})月(\d{1,2})日/.exec(startTime.value);
    if (m) {
        customPicker1.setAttribute('start', parseInt(m[1]));
        customPicker2.setAttribute('start', parseInt(m[2]))
        customPicker3.setAttribute('start', parseInt(m[3]))

    }
    const button = customSelect.querySelector('button');
    button.addEventListener('click', evt => {
        endTime.setAttribute('value', `${customPicker1.value}年${customPicker2.value}月${customPicker3.value}日`);
        customSelect.remove();
    })

}

async function initializePeoples() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        peoples.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择可约课次数')

    const names = [...new Array(26).keys()].map(x => (x + 7)).reverse();
    customOptions.populateData(names, peoples.value);
}

customSubmitBar.addEventListener('close', evt => {
    history.back();
});

customSubmitBar.addEventListener('submit', async evt => {
    const card_id = (lessons && lessons.filter(x => x.title === lessonName.value)[0].id) || 0;
    //const date_time = dateToSeconds(dateTime.value);
    const start_date = dateToSeconds(startTime.value);
    const end_date = dateToSeconds(endTime.value);
    const times = parseInt(peoples.value) || 0;

    try {
        const response = await fetch(`${baseUri}/api/card.insert`, {
            method: 'POST',
            body: JSON.stringify({
                card_id,
                start_date,
                end_date,
                times,
                user_id: parseInt(id)
            })
        })
        await response.text();
        document.getElementById('toast').setAttribute('message', '成功');
    } catch (error) {
        document.getElementById('toast').setAttribute('message', '无法更新数据');
    }

});


async function getJson() {
    const response = await fetch(`${baseUri}/api/user.query?id=${id}`);
    return response.json();
}

async function renderUserName() {
    const obj = await getJson();
    const userName = document.querySelector('.user_name');
    userName.setAttribute('value', obj.name || obj.nick_name);
}
renderUserName();