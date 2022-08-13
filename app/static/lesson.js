let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
const teacherName = document.querySelector('#teacher-name');
const title = document.querySelector('#title');


const thumbnail = document.querySelector('#thumbnail');
const description = document.querySelector('#description');
const photoItems = document.querySelector('#photo-items');

const subtitle = document.querySelector('#subtitle');

async function loadData() {
        const response = await fetch(`${baseUri}/api/coach.lesson?id=${id}`);
        return response.json();
}

async function render() {
        let obj;
        try {
                obj = await loadData();
                teacherName.textContent = obj.teacher_name;
                title.textContent = obj.name;
                thumbnail.setAttribute('src', `https://static.lucidu.cn/images/${obj.image}`);
                var md = window.markdownit();
                if (obj.description)
                        description.innerHTML = md.render(obj.description);
                document.title = `${obj.name} - ${obj.teacher_name}`;
                subtitle.textContent = `${getShortDateString(obj.date_time)} ${secondsToDuration(obj.start_time)}-${secondsToDuration(obj.end_time)}`;

                obj.photos.forEach(element => {
                        const photoItem = document.createElement('div');
                        photoItem.setAttribute("class", "photo-item");

                        photoItem.style.backgroundImage = `url(https://static.lucidu.cn/images/${element})`;

                        photoItems.appendChild(photoItem)
                });

        } catch (e) {
                console.log(e);
                document.getElementById('toast').setAttribute('message', '发生未知错误');
        }
}

render();



// teacherName.setAttribute('', '');
// teacherName.textContent = '';


const backButton = document.querySelector('#back-button');
backButton.addEventListener('click', evt => {
        console.log("-------------------------");
        history.back();
})
// backButton.setAttribute('', '');
// backButton.textContent = '';


const submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', evt => {

})
// submitButton.setAttribute('', '');
// submitButton.textContent = '';



// description.setAttribute('', '');
// description.textContent = '';



const expandButton = document.querySelector('#expand-button');
expandButton.addEventListener('click', evt => {
        if (expandButton.dataset.expand === 'true') {
                expandButton.querySelector('svg').style.transform = 'rotate(0deg)';
                expandButton.dataset.expand = 'false';
                expandButton.querySelector('div').textContent = '展开';
                description.classList.add('lines');
        } else {
                expandButton.querySelector('svg').style.transform = 'rotate(180deg)';
                expandButton.dataset.expand = 'true';
                expandButton.querySelector('div').textContent = "收起";
                description.classList.remove('lines');
        }

})
// expandButton.setAttribute('', '');
// expandButton.textContent = '';




const photos = document.querySelector('#photos');
photos.addEventListener('click', evt => {

})


const commentButton = document.querySelector('#comment-button');
commentButton.addEventListener('click', evt => {

});

