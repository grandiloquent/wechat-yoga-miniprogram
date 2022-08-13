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

async function loadData() {
    const response = await fetch(`${baseUri}/api/lesson.query?id=${id}`);
    return response.json();
}
const lessonName = document.querySelector('.lesson_name');
lessonName.addEventListener('click', evt => {
    initializeLesson();
})
// const dateTime = document.querySelector('.date_time');
// dateTime.addEventListener('click', evt => {
//     initializeDate()
// })
const teacherName = document.querySelector('.teacher_name');
teacherName.addEventListener('click', evt => {
    initializeTeacher()
})

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

async function render() {

    try {
        obj = await loadData();
        lessonName.setAttribute('value', obj.name);
        //dateTime.setAttribute('value', getShortDateString(obj.date_time));
        startTime.setAttribute('value', secondsToDuration(obj.start_time));
        endTime.setAttribute('value', secondsToDuration(obj.end_time));
        teacherName.setAttribute('value', obj.teacher_name);
        peoples.setAttribute('value', obj.peoples);

    } catch (e) {
        document.getElementById('toast').setAttribute('message', '成功');
    }
}



async function getLessons() {
    const response = await fetch(`${baseUri}/api/lesson.query.names`)
    return response.json();
}
async function getTeachers() {
    const response = await fetch(`${baseUri}/api/teacher.query.names`)
    return response.json();
}
async function initializeLesson() {

    if (!lessons) {
        lessons = await getLessons();
    }
    // #e8f0fe
    // #1967d2options
    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        lessonName.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择课程')
    const names = lessons.map(x => x.name);
    customOptions.populateData(names, lessonName.value);
}

async function initializeDate() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        dateTime.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择开课日期')
    const s = new Date().setHours(0, 0, 0, 0) / 1000;
    const names = [...new Array(14).keys()].map(x => getShortDateString(s + 86400 * (x + 1))).reverse();
    customOptions.populateData(names, dateTime.value);
}
async function initializeStartTime() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        startTime.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择开课时间')

    const names = ["9:00", "10:00", "19:30", "20:30"].reverse();
    customOptions.populateData(names, startTime.value);
}
async function initializeEndTime() {

    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        endTime.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择开课时间')

    const names = ["9:00", "10:00", "19:30", "20:30"].reverse();
    customOptions.populateData(names, endTime.value);

}

async function initializeTeacher() {

    if (!teachers) {
        teachers = await getTeachers();
    }
    // #e8f0fe
    // #1967d2options
    const customSelect = document.createElement('custom-select');
    document.body.appendChild(customSelect);

    const customOptions = document.createElement('custom-options');
    customOptions.addEventListener('submit', evt => {
        teacherName.setAttribute('value', evt.detail);
        customSelect.remove();
    })
    customSelect.appendChild(customOptions);
    customSelect.setAttribute('title', '选择老师')
    const names = teachers.map(x => x.name);
    customOptions.populateData(names, teacherName.value);
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
    customSelect.setAttribute('title', '选择开课时间')

    const names = [...new Array(18).keys()].map(x => (x + 8)).reverse();
    customOptions.populateData(names, peoples.value);
}
render();

customSubmitBar.addEventListener('close', evt => {
    history.back();
});
function dateToSeconds(string) {
    const match = /(\d+)月(\d+)日/.exec(string);
    const t = new Date();
    t.setMonth(parseInt(match[1]) - 1);
    t.setDate(parseInt(match[2]));
    t.setHours(0, 0, 0, 0)
    return t / 1000;
}
customSubmitBar.addEventListener('submit', async evt => {
    const lesson_id = (lessons && lessons.filter(x => x.name === lessonName.value)[0].id) || 0;
    //const date_time = dateToSeconds(dateTime.value);
    const start_time = durationToSeconds(startTime.value) * 60;
    const end_time = durationToSeconds(endTime.value) * 60;
    const teacher_id = (teachers && teachers.filter(x => x.name === teacherName.value)[0].id) || 0;
    const ps = parseInt(peoples.value);

    try {
        const response = await fetch(`${baseUri}/api/lesson.update`, {
            method: 'POST',
            body: JSON.stringify({
                lesson_id,
                //date_time,
                start_time,
                end_time,
                teacher_id,
                peoples: ps,
                id: parseInt(id)
            })
        })
        await response.text();
        document.getElementById('toast').setAttribute('message', '成功');
    } catch (error) {
        document.getElementById('toast').setAttribute('message', '无法更新数据');
    }

});