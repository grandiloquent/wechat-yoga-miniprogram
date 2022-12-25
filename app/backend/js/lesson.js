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
//==================//


updateLesson.addEventListener('click', updateLessonHandler);



function deleteBook(student) {

}
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
pickerLesson.setAttribute('class','');
pickerLesson.style.display='block'
*/
async function queryLessonInfo() {
  try {
    const response = await fetch(`/v1/admin/lesson/info`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    });
    const obj = await response.json();
  } catch (error) {
    console.log(error);
  }
}
//==================//

suspendLesson.addEventListener('click', suspendLessonHandler);


async function render() {
  const wrapper = document.querySelector('.wrapper');
  let obj;
  try {
    obj = await loadData();
    image.src = `https://lucidu.cn/images/${obj.thumbnail}`;
    title.textContent = obj.lesson_name;
    subheadText.textContent = formatSubtitle(obj);
    console.log(obj);
    obj.students.forEach((element, index) => {
      appendUser(element);
    })

  } catch (error) {}
}
render();