async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  if (response.status > 399 || response.status < 200) {
    throw new Error(`${response.status}: ${response.statusText}`)
  }
  return response.json();
}

async function render() {
  if (!id) return;
  let obj;
  try {
    obj = await loadData();
    customLesson.data = obj;
    customLessonItems.data = obj.students;
    customLesson.expired = !checkIfLessonAvailable(obj);
    suspended = checkIfLessonSuspended(obj);
    customLesson.suspended = suspended;
  } catch (error) {
    console.log(error);
  }
}
/*
hidden =  -1 预约人数不足停课
hidden = 1 停课
*/
async function suspendClasses(action) {
  try {
    const response = await fetch(`${baseUri}/v1/admin/lesson?id=${id}&action=${action || 1}`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    });
    if (response.status > 399 || response.status < 200) {
      throw new Error(response.statusText);
    }
    const obj = await response.text();
    console.log(obj);
    location.reload();
  } catch (error) {
    console.log(error);
  }
}

async function onCustomLessonSubmit(evt) {
  switch (evt.detail) {
    case 1: {
      customDialog.message = suspended ? "您确定要开课吗？" : "您确定要停课吗？"
      customDialog.removeAttribute('style');
      customDialog.onsubmit = async evt => {
        if (evt.detail === 2) {
          suspendClasses(suspended ? 2 : 1)
        }
      }
      break;
    }
    case 2: {
      window.location = `./updateLesson?id=${id}&returnUrl=${encodeURIComponent(`/lesson?id=${id}`)}`
      break;
    }
    case 3: {
      const returnUrl = new URL(document.URL).searchParams.get('returnUrl');
      if (returnUrl) {
        window.location = returnUrl;
      } else {
        history.back();
      }
      break;
    }
  }
}
async function onSubmitBar(evt) {
  if (evt.detail === "1") {
    const data = {
      name: nameInput.value
    }
    if (id) {
      data.id = id;
    }
    try {
      const response = await fetch(`
          $ {
            baseUri
          }
          /v1/admin / `, {
        method: 'POST',
        headers: {
          "Authorization": window.localStorage.getItem("Authorization")
        },
        body: JSON.stringify(data)
      });
      const obj = await response.text();
      toast.setAttribute('message', '成功');
    } catch (error) {
      console.log(error);
    }
  } else {
    history.back();
  }
}

function checkIfLessonSuspended(lesson) {
  if (lesson.hidden && lesson.hidden === 1) {
    return true;
  }
  return false;
}
/*
检查课程是否已过期
*/
function checkIfLessonAvailable(lesson) {
  const d = new Date();
  const dateSeconds = new Date(d).setHours(0, 0, 0, 0) / 1000;
  if (dateSeconds > lesson.date_time) {
    return false;
  }
  const timeSeconds = d.getHours() * 3600 + d.getMinutes() * 60;
  /*
  开课前1小时停止约课
  */
  if (dateSeconds === lesson.date_time && timeSeconds > lesson.start_time - 3600) {
    return false;
  }
  return true;
}
function deleteHandler(evt) {
  customDialog.message = `您确定要删除 "${evt.detail.name}" 的预约吗？`
  customDialog.removeAttribute('style');
  customDialog.onsubmit = async e => {
    if (e.detail === 2) {
      await deleteUserBooked(evt.detail.id);
      await render();
    }
  }
}
async function deleteUserBooked(id) {
  try {
    const response = await fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    });
    if (response.status > 399 || response.status < 200) {
      throw new Error(`${response.status}: ${response.statusText}`)
    }
    const results = await response.text();
  } catch (error) {
    console.log(error);
  }
}
//------------------------------------------------

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8082' : ''
const id = new URL(document.URL).searchParams.get('id');
let suspended;

render();
