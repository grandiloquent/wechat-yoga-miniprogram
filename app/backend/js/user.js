let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
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
    let lessons = await loadLessons(dateInSeconds - 86400 - 365, dateInSeconds + 86400 + 365);

    console.log(lessons);
    if (!lessons)
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