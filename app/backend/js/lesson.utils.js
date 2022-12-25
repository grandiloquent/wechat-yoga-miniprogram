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

function formatWeek(date) {
  return '日一二三四五六'.split('')[date.getDay()];
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
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}

function formatSubtitle(obj) {
  const date = new Date(obj.date_time * 1000);
  return `${((obj.class_type === 1) && '小班') || ((obj.class_type === 4) && '团课')} • ${obj.teacher_name} • ${date.getMonth() + 1}月${date.getDate()}日周${formatWeek(date)} • ${formatSeconds(obj.start_time)}`;
}
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
function popupButtonBackHandler(evt) {
  popup.style.display = "none";
}
function updateLessonHandler() {
  popup.style.display = "block";
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