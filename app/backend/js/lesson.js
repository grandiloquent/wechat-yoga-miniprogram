const suspendLesson = document.querySelector('#suspend-lesson');
const id = new URL(document.URL).searchParams.get('id') || 415;
const actions = document.querySelector('.actions');
const image = document.querySelector('#image');
const title = document.querySelector('#title'); 
const updateLesson = document.getElementById('update-lesson');
//==================//

const subheadText = document.querySelector('#subhead-text');

updateLesson.addEventListener('click',updateLessonHandler);

function updateLessonHandler(){
}

/*
updateLesson.textContent='';
updateLesson.setAttribute('class','');
*/
//==================//
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''

suspendLesson.addEventListener('click', suspendLessonHandler);


async function render() {
  const wrapper = document.querySelector('.wrapper');
  let obj;
  try {
    obj = await loadData();
    image.src = `https://lucidu.cn/images/${obj.thumbnail}`;
    title.textContent = obj.lesson_name;
    subheadText.textContent = formatSubtitle(obj);
  } catch (error) {}
}
render();