let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id') || 787;

async function loadData() {
  const response = await Promise.all([
    fetch(`${baseUri}/v1/admin/lesson/info`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    }),  fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    })
  ])
  return response;
}
async function render() {
  let results;
  try {
    results = await loadData();
    const obj =await results[0].json();
    console.log(obj, results);
    startTime.data = paddingArray([...new Array(25).keys()].map(x => {
      const m = x * 30 + 60 * 9;
      return `${m / 60 | 0}:${(m % 60).toString().padEnd(2, '0')}`;
    }));
    lesson.data = paddingArray(obj.lessons);
    lessonType.data = paddingArray([
      "团课", "小班", "私教"
    ]);
    teacher.data = paddingArray(obj.teachers);
    endTime.data = paddingArray([...new Array(25).keys()].map(x => {
      const m = x * 30 + 60 * 9;
      return `${m / 60 | 0}:${(m % 60).toString().padEnd(2, '0')}`;
    }));
    peoples.data = paddingArray([...new Array(9).keys()].map(x => `${x + 8}`));
  } catch (error) {
    console.log(error);
  }
}


function paddingArray(array) {
  const dif = array.length % 4;
  for (let j = 0; j < 4 - dif; j++) {
    array.push('');
  }
  return array;
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

function onStartTimeSubmit(evt) {
  endTime.selectedItem = formatSeconds(durationToSeconds(evt.detail + ":00") + 3600);
}
async function onSubmitBar(evt) {
  if (evt.detail === "1") {
    const data = {
      lesson: lesson.selectedItem,
      class_type: ((lessonType.selectedItem === '小班') && 1) || ((lessonType.selectedItem === '私教') && 2) || ((lessonType.selectedItem === '团课') && 4),
      peoples: parseInt(peoples.selectedItem || '0'),
      start_time: durationToSeconds(startTime.selectedItem + ":00"),
      end_time: durationToSeconds(endTime.selectedItem + ":00"),
      teacher: teacher.selectedItem
    }
    try {
      const response = await fetch(`${baseUri}/v1/admin/lesson`, {
        method: 'POST',
        headers: {
          "Authorization": window.localStorage.getItem("Authorization")
        },
        body: JSON.stringify(data)
      });
      const obj = await response.text();
    } catch (error) {
      console.log(error);
    }
    toast.setAttribute('message', '成功');
  } else {
    history.back();
  }
}
render();
// 