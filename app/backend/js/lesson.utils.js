function appendUser(iterator) {
  const item = document.createElement('div');
  item.setAttribute("class", "item");
  const itemImage = document.createElement('img');
  itemImage.setAttribute("class", "item-image");
  itemImage.setAttribute("src", `${iterator.avatar_url}`);
  item.appendChild(itemImage);
  const itemContent = document.createElement('div');
  itemContent.setAttribute("class", "item-content");
  item.appendChild(itemContent);
  const itemTitle = document.createElement('div');
  itemTitle.setAttribute("class", "item-title");
  itemContent.appendChild(itemTitle);
  itemTitle.textContent = `${iterator.name || iterator.nick_name}`;
  const itemRight = document.createElement('div');
  itemRight.setAttribute("class", "item-right");
  item.appendChild(itemRight);
  if (!expired) {
    const itemAction = document.createElement('div');
    itemAction.setAttribute("class", "item-action");
    itemRight.appendChild(itemAction);
    itemAction.textContent = `删除`;
    itemAction.addEventListener('click', evt => {
      evt.stopPropagation();
      deleteBook(iterator, item);
    });
  }
  section.insertAdjacentElement('afterend', item);
}

function durationToSeconds(duration) {
  let result = 0;
  if (/(\d{1,2}:){1,2}\d{1,2}/.test(duration)) {
    const pieces = duration.split(':');
    for (let i = pieces.length - 1; i > -1; i--) {
      result += Math.pow(60, i) * parseInt(pieces[pieces.length - i - 1]);
    }
    return result;
  }
  result = parseInt(duration);
  if (isNaN(result)) {
    result = 0;
  }
  return result;
}

function formatSeconds(s) {
  if (isNaN(s)) return '0:00';
  if (s < 0) s = -s;
  const time = {
    hour: Math.floor(s / 3600) % 24,
    minute: Math.floor(s / 60) % 60,
  };
  return Object.entries(time)
    .filter((val, index) => index || val[1])
    .map(val => (val[1] + '').padStart(2, '0'))
    .join(':');
}

function formatSubtitle(obj) {
  const date = new Date(obj.date_time * 1000);
  return `${((obj.class_type === 1) && '小班') || ((obj.class_type === 4) && '团课')} • ${obj.teacher_name} • ${date.getMonth() + 1}月${date.getDate()}日周${formatWeek(date)} • ${formatSeconds(obj.start_time)}`;
}

function formatWeek(date) {
  return '日一二三四五六'.split('')[date.getDay()];
}
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}

function paddingArray(array) {
  const dif = array.length % 4;
  for (let j = 0; j < 4 - dif; j++) {
    array.push('');
  }
}

function popupButtonBackHandler(evt) {
  popup.style.display = "none";
}
async function render() {
  const wrapper = document.querySelector('.wrapper');
  let obj;
  try {
    obj = await loadData();
    image.src = `https://lucidu.cn/images/${obj.thumbnail}`;
    title.textContent = obj.lesson_name;
    subheadText.textContent = formatSubtitle(obj);
    obj.students && obj.students.forEach((element, index) => {
      appendUser(element);
    })
    await queryLessonInfo(obj);
  } catch (error) {
    console.log(error);
  }
}

function setLesson(obj, lesson) {
  paddingArray(obj.lessons);
  pickerLesson.setAttribute('title', '课程');
  pickerLesson.setAttribute('data', JSON.stringify(obj.lessons));
  pickerLesson.setAttribute('select', lesson.lesson_name);
}

function setLessonType(obj, lesson) {
  pickerLessonType.setAttribute('title', '课程类型');
  pickerLessonType.setAttribute('data', JSON.stringify([
    "团课", "小班", "私教", ''
  ]));
  pickerLessonType.setAttribute('select', (lesson.class_type === 1 && '小班') || (lesson.class_type === 2 && '私教') ||
    (lesson.class_type === 4 && '团课'));
}

function setStartTime(obj, lesson) {
  pickerStartTime.setAttribute('title', '开课时间');
  const array = [...new Array(25).keys()].map(x => {
    const m = x * 30 + 60 * 9;
    return `${m / 60 | 0}:${(m % 60).toString().padEnd(2, '0')}`;
  });
  paddingArray(array);
  pickerStartTime.setAttribute('data', JSON.stringify(array));
  pickerStartTime.setAttribute('select', `${lesson.start_time / 3600 | 0}:${(lesson.start_time % 3600 / 60).toString().padEnd(2, '0')}`);
}

function setTeacher(obj, lesson) {
  paddingArray(obj.teachers);
  pickerTeacher.setAttribute('title', '老师');
  pickerTeacher.setAttribute('data', JSON.stringify(obj.teachers));
  pickerTeacher.setAttribute('select', lesson.teacher_name);
}

function showSuspendLessonDialog(handler) {
  const customDialog = document.createElement('custom-dialog');
  customDialog.addEventListener('submit', handler);
  customDialog.setAttribute('title', `您确定要停课吗？`)
  document.body.appendChild(customDialog);
}
async function suspendLessonHandler(evt) {
  showSuspendLessonDialog(async evt => {
    evt.stopPropagation();
    evt.target.remove();
    try {
      const response = await fetch(`/v1/admin/lesson/suspend?id=${id}`, {
        headers: {
          "Authorization": window.localStorage.getItem("Authorization")
        }
      })
      const obj = await response.json();
      actions.classList.add('disabled');
    } catch (error) {
      console.log(error);
    }
  })
}
async function updateLessonHandler() {
  popup.style.display = "block";
}

function setPeoples(obj, lesson) {
  const array = [...new Array(9).keys()].map(x => x + 8);
  paddingArray(array);
  pickerPeoples.setAttribute('title', '人数');
  pickerPeoples.setAttribute('data', JSON.stringify(array));
  pickerPeoples.setAttribute('select', lesson.peoples);
}
async function queryLessonInfo(lesson) {
  try {
    const response = await fetch(`${baseUri}/v1/admin/lesson/info`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    });
    const obj = await response.json();
    setLesson(obj, lesson);
    setLessonType(obj, lesson);
    setTeacher(obj, lesson);
    setStartTime(obj, lesson);
    setPeoples(obj, lesson);

  } catch (error) {
    console.log(error);
  }
}

/*
const observer = new(class Observer {
constructor() {}
});
document.querySelectorAll('[bind]').forEach(value => {
const keys = value.getAttribute('bind').split(':');
value.addEventListener(keys[0], evt => {
window[keys[1]](evt);
})
})
*/