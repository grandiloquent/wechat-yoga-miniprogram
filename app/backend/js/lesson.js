let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id') || 787;
let old_start_time, old_class_type;
async function loadData() {
  const response = await Promise.all([
    fetch(`${baseUri}/v1/admin/lesson/info`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    }), fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
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
    const obj = await results[0].json();
    const lessonObj = await results[1].json();
    startTime.data = paddingArray([...new Array(25).keys()].map(x => {
      const m = x * 30 + 60 * 9;
      return `${m / 60 | 0}:${(m % 60).toString().padEnd(2, '0')}`;
    }));
    startTime.selectedItem = formatSeconds(lessonObj.start_time).replace(/^0+/, '');
    old_start_time = lessonObj.start_time;
    old_class_type = lessonObj.class_type;
    lesson.data = paddingArray(obj.lessons);
    lesson.selectedItem = lessonObj.lesson_name;
    lessonType.data = paddingArray([
      "团课", "小班", "私教"
    ]);
    lessonType.selectedItem = ((lessonObj.class_type === 1 && '小班') || (lessonObj.class_type === 2 && '私教') || (lessonObj.class_type === 4 && '团课'));
    teacher.data = paddingArray(obj.teachers);
    teacher.selectedItem = lessonObj.teacher_name;
    endTime.selectedItem = formatSeconds(lessonObj.end_time).replace(/^0+/, '');
    endTime.data = paddingArray([...new Array(25).keys()].map(x => {
      const m = x * 30 + 60 * 9;
      return `${m / 60 | 0}:${(m % 60).toString().padEnd(2, '0')}`;
    }));
    peoples.data = paddingArray([...new Array(9).keys()].map(x => `${x + 8}`));
    peoples.selectedItem = lessonObj.peoples + '';
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
      //class_type: ((lessonType.selectedItem === '小班') && 1) || ((lessonType.selectedItem === '私教') && 2) || ((lessonType.selectedItem === '团课') && 4),
      peoples: parseInt(peoples.selectedItem || '0'),
      start_time: durationToSeconds(startTime.selectedItem + ":00"),
      end_time: durationToSeconds(endTime.selectedItem + ":00"),
      teacher: teacher.selectedItem,
      id,
      old_start_time,
      old_class_type
    }
    try {
      const response = await fetch(`${baseUri}/v1/admin/lesson`, {
        method: 'POST',
        headers: {
          "Authorization": window.localStorage.getItem("Authorization")
        },
        body: JSON.stringify(data)
      });
      if (response.status > 399 || response.status < 200) {
        throw new Error();
      }
      const obj = await response.text();
      toast.setAttribute('message', '成功');
    } catch (error) {
      console.log(error);
      toast.setAttribute('message', '错误');
    }

  } else {
    history.back();
  }
}
render();
// 