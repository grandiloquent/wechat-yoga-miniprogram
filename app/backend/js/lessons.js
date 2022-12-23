function filterHandler(evt) {

  if (evt.detail <= 4) {
    const date = new Date().setHours(0, 0, 0, 0) / 1000 + (evt.detail - 1) * 86400;
    render(date, date + 86400);
  } else {
    const date = new Date().setHours(0, 0, 0, 0) / 1000 + (evt.detail - 6) * 86400;
    render(date, date + 86400);
  }
}
async function loadLessonsData(start, end) {
  console.log(window.localStorage.getItem("Authorization"))
  const res = await fetch(`${baseUri}/v1/admin/lessons?start=${start}&end=${end}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  });
  return await res.json();
}

function navigateToLessonHandler(evt) {
  evt.stopPropagation();
  window.location = `lesson?id=${iterator.course_id}`;
}

function sortLessons(obj) {
  return obj.sort((x, y) => {
    if (x.date_time === y.date_time) {
      return x.start_time - y.start_time
    } else
      return x.date_time - y.date_time
  });
}

function formatLessonType(lesson) {
  return (lesson.class_type === 4 && '团课') || (lesson.class_type === 1 && '小班') || ''
}

function formatLessonDateTime(lesson) {
  const date = new Date(lesson.date_time * 1000);
  return `周${'日一二三四五六'[date.getDay()]} ${lesson.start_time / 3600 | 0}:${((lesson.start_time % 3600) / 60 | 0).toString().padStart(2, '0')}`
}
const baseUri = window.location.host === '127.0.0.1:5500' ? 'http://127.0.0.1:8081' : '';

const customHeader = document.querySelector('custom-header');
const layout = document.querySelector('#layout');
const customFilter = document.querySelector('custom-filter');


customHeader.setAttribute('title', "课程");

const date = new Date().setHours(0, 0, 0, 0) / 1000;
render(date, date + 86400);

customFilter.addEventListener('submit', filterHandler);
// 加载课程数据

async function render(start, end) {

  layout.innerHTML = '';
  let obj = await loadLessonsData(start, end);

  sortLessons(obj);

obj .forEach((lesson,index)=>{
  const customMiniItem = document.createElement('custom-mini-item');
    customMiniItem.style.width = '100%'
    layout.appendChild(customMiniItem);

  customMiniItem.setAttribute("image", `https://lucidu.cn/images/${lesson.thumbnail}`);
                customMiniItem.setAttribute("title", lesson.lesson_name);

let dif = parseInt(lesson.peoples) - parseInt(lesson.count);
    customMiniItem.setAttribute("bottom-title", dif > 0 ? `差 ${dif} 人` : '已满额');
    customMiniItem.setAttribute("bottom-subhead", formatLessonDateTime(lesson));
    customMiniItem.setAttribute("subhead", formatLessonType(lesson));
    customMiniItem.addEventListener('click', navigateToLessonHandler);
  })

}