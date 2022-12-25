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
const pickerPeoples = document.getElementById('picker-peoples');
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
    setPeoples(obj, lesson);

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
pickerPeoples.addEventListener('click', pickerPeoplesHandler);

function pickerPeoplesHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
}

/*
pickerPeoples.textContent='';
pickerPeoples.setAttribute('class','');
pickerPeoples.style.display='block'
*/
//==================//


render();