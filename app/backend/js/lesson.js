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
//==================//
suspendLesson.addEventListener('click', suspendLessonHandler);
updateLesson.addEventListener('click', updateLessonHandler);
popupButtonBack.addEventListener('click', popupButtonBackHandler);
function deleteBook(student) {}



//==================//


render();