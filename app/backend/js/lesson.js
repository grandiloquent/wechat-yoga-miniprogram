const id = new URL(document.URL).searchParams.get('id') || 415;
const baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : '';
let expired = false;
const suspendLesson = document.querySelector('#suspend-lesson');
const image = document.querySelector('#image');
const title = document.querySelector('#title');
const updateLesson = document.getElementById('update-lesson');
const actions = document.getElementById('actions');
const subheadText = document.querySelector('#subhead-text');
const section = document.getElementById('section');
const popup = document.getElementById('popup');
const popupButtonBack = document.getElementById('popup-button-back');
const pickerLesson = document.getElementById('picker-lesson');
const pickerLessonType = document.getElementById('picker-lesson-type');
const pickerTeacher = document.getElementById('picker-teacher');
const pickerStartTime = document.getElementById('picker-start-time');
//==================//
suspendLesson.addEventListener('click', suspendLessonHandler);
updateLesson.addEventListener('click', updateLessonHandler);

function deleteBook(student) {}
popup.addEventListener('click', popupHandler);

function popupHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}
popupButtonBack.addEventListener('click', popupButtonBackHandler);
pickerLesson.addEventListener('click', pickerLessonHandler);

function pickerLessonHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}
/*
pickerLesson.textContent='';
pickerLesson.style.display='block'
*/
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
  } catch (error) {
    console.log(error);
  }
}
pickerLessonType.addEventListener('click', pickerLessonTypeHandler);

function pickerLessonTypeHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}

pickerTeacher.addEventListener('click', pickerTeacherHandler);

function pickerTeacherHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}


pickerStartTime.addEventListener('click', pickerStartTimeHandler);

function pickerStartTimeHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}

/*
pickerStartTime.textContent='';
pickerStartTime.setAttribute('class','');
pickerStartTime.style.display='block'
*/
//==================//


render();