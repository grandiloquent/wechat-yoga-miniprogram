let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8082' : ''
const id = new URL(document.URL).searchParams.get('id');
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/user?id=${id}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}

async function loadLessons(start, end) {
  const response = await fetch(`${baseUri}/v1/admin/user?id=${id}&start=${start}&end=${end}&action=1`, {
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
    customUserProfile.data = obj;
    const now = new Date();
    const dateInSeconds = now.setHours(0, 0, 0, 0) / 1000; // 86400
    let lessons = await loadLessons(dateInSeconds, dateInSeconds + 86400);
    if (lessons)
      customUserLessons.data = lessons;
  } catch (error) {
    console.log(error);
  }
}
render();

function onNameInput(evt) {
  console.log(evt.detail);
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

async function onCustomUserLessons(evt) {
  const now = new Date();
  const dateInSeconds = now.setHours(0, 0, 0, 0) / 1000;
  let start, end;
  try {
    switch (evt.detail) {
      case "0":
        start = dateInSeconds;
        end = dateInSeconds + 86400;
        break;
      case "1":
        start = dateInSeconds + 86400;
        end = dateInSeconds + 86400 * 2;
        break;
      case "2":
        start = dateInSeconds;
        end = dateInSeconds + 86400 * 14;
        break;
      case "3":
        start = dateInSeconds - 86400 * 30;
        end = dateInSeconds;
        break;
      case "4":
        start = dateInSeconds - 86400 * 365;
        end = dateInSeconds;
        break;
      case "5":
        start = 0;
        end = dateInSeconds;
        break;
    }
    let lessons = await loadLessons(start, end);
    if (lessons)
      customUserLessons.data = lessons;
  } catch (error) {
    customUserLessons.data = [];
  }

}