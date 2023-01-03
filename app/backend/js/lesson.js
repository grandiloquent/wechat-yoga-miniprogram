let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id');
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/lesson?id=${id}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render() {
  if (!id) return;
  let obj;
  try {
    obj = await loadData();
    customLesson.data = obj;
    customLesson.expired = !checkIfLessonAvailable(obj);
  } catch (error) {}
}
render();


async function onCustomLessonSubmit(evt) {
  switch (evt.detail) {
    case 1: {
      customDialog.message = "您确定要停课吗？"
      customDialog.removeAttribute('style');
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
      const response = await fetch(`${baseUri}/v1/admin/`, {
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
 
function checkIfLessonAvailable(lesson) {
  if (lesson.hidden && lesson.hidden === 1) {
    return false;
  }
  const d = new Date();
  const seconds = new Date(d).setHours(0, 0, 0, 0) / 1000;
  if (seconds > lesson.date_time || ((d.getHours() * 3600 +d.getMinutes() * 60) > lesson.start_time - 3600)) {
    return false;
  }
  return true;
}