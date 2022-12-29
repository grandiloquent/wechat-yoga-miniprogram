let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
const id = new URL(document.URL).searchParams.get('id') || 1;

async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/market`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render() {
  let obj;
  try {
    obj = await loadData();
    titleInput.value = obj.title;
    customTextarea.value = obj.content;
    sloganInput.value = obj.slogan;
  } catch (error) {

  }
}

async function onSubmitBar() {
  const data = {};
  data.id = 1;
  data.title = titleInput.value.trim();
  data.content = customTextarea.value.trim();
  data.slogan = sloganInput.value.trim();
  try {
    const response = await fetch(`${baseUri}/v1/admin/market/update`, {
      method: 'POST',
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      },
      body: JSON.stringify(data)
    });
    await response.text();
    toast.setAttribute('message', '成功');
  } catch (error) {
    console.log(error);
    toast.setAttribute('message', '失败');
  }
}

render();