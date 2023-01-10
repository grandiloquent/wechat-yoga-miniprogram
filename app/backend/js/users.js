let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8082' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/user?action=2`, {
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
    customUsers.data = obj;
  } catch (error) {

  }
}
render();