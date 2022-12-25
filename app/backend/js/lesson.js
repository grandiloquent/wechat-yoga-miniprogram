const id = new URL(document.URL).searchParams.get('id') || 348;
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
const submit = document.getElementById('submit');
const popupClose = document.getElementById('popup-close');
//==================//
suspendLesson.addEventListener('click', suspendLessonHandler);
updateLesson.addEventListener('click', updateLessonHandler);
popupButtonBack.addEventListener('click', popupButtonBackHandler);

function deleteBook(student) {}



submit.addEventListener('click', submitHandler);

function submitHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
  popup.style.display = 'none';

  const class_type = ((pickerLessonType.selectedItem === '小班') && 1) || ((pickerLessonType.selectedItem === '团课') && 4);
  const lesson_name = pickerLesson.selectedItem;
  const peoples = parseInt(pickerPeoples.selectedItem || '0');
  const start_time = durationToSeconds(pickerStartTime.selectedItem + ":00");
  const end_time = start_time + 3600;
  const teacher_name = pickerTeacher.selectedItem;
  console.log({
    class_type,
    lesson_name,
    peoples,
    start_time,
    end_time,
    teacher_name
  });
}


popupClose.addEventListener('click', popupCloseHandler);

function popupCloseHandler(evt) {
  evt.stopPropagation();
  evt.stopImmediatePropagation();
  popup.style.display = 'none';
}

/*
popupClose.textContent='';
popupClose.setAttribute('class','');
popupClose.style.display='block'
*/
//==================//


render();