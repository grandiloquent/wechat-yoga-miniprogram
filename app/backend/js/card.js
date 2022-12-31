let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id');
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/card?id=${id}`, {
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
    titleInput.value = obj.title;
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
      title: titleInput.value
    }
    if (id) {
      data.id = parseInt(id);
    }
    try {
      const response = await fetch(`${baseUri}/v1/admin/card`, {
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

function onCardTypeTap(evt) {
  customActionSheet.removeAttribute('style');
}
async function onClose(evt) {
  console.log(evt);
}

function onItem(evt) {
  console.log(evt);
}
customActionSheet.data = ["期卡", "次卡"]