let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id');
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/teacher?id=${id}`, {
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
    console.log(obj);
    nameInput.value = obj.name;
    introductionInput.value = obj.introduction;
    customUploader.images = [`https://static.lucidu.cn/images/${obj.thumbnail}`];
  } catch (error) {}
}
render();

function onNameInput(evt) {
  console.log(evt.detail);
}
async function onSubmitBar(evt) {
  if (evt.detail === "1") {
    let name = nameInput.value;
    if (!name) {
      toast.setAttribute('message', '请输入名称');
      return;
    }
    let introduction = introductionInput.value;
    if (!introduction) {
      toast.setAttribute('message', '请输入简介');
      return;
    }

    let thumbnail = customUploader.images;
    if (!thumbnail) {
      toast.setAttribute('message', '请上传头像');
      return;
    }
    thumbnail = substringAfterLast(thumbnail[0],"/");


    const data = {
      name,
      introduction,
      phone_number: introductionInput.value,
      thumbnail
    }
    if (id) {
      data.id = id;
    }
    try {
      const response = await fetch(`${baseUri}/v1/admin/teacher`, {
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

function substringAfterLast(string, delimiter, missingDelimiterValue) {
  const index = string.lastIndexOf(delimiter);
  if (index === -1) {
    return missingDelimiterValue || string;
  } else {
    return string.substring(index + delimiter.length);
  }
}