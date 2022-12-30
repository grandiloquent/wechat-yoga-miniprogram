customBottomBar.data = [{
  path: `<path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>`,
  title: "新建",
  href: "card"
}]
async function navigate(evt) {
  switch (evt.detail) {
    case 'card':
      location = "./card"
      break;
  }
}
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id');
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/?id=${id}`, {
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
    nameInput.value = obj.name;
  } catch (error) {}
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