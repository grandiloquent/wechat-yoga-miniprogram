
customBottomBar.data = [{
  path: `<path d="M18.984 12.984h-6v6h-1.969v-6h-6v-1.969h6v-6h1.969v6h6v1.969z"></path>`,
  title: "新建",
  href: "teacher"
}]

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''

async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/teacher?action=2`, {
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
    customTeachers.data = obj;
  } catch (error) {}
}
render();