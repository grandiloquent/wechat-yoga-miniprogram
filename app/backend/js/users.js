
////////////////////////////////////////////////////////////////////////////
customElements.whenDefined('custom-actions').then(() => {
  customActions.data = [{
    title: "活跃用户",
    id: 1,
  }, {
    title: "全部", id: 2,
  }]
})
let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8082' : ''
async function loadData(action) {
  const response = await fetch(`${baseUri}/v1/admin/user?action=${action}`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render(action = 2) {

  let obj;
  try {
    obj = await loadData(action);
    customUsers.data = obj.sort((x, y) => {
      if (!x.lasted || !y.lasted) return -1;
      return y.lasted - x.lasted;
    });
  } catch (error) {

  }
}

function onCustomActionsSubmit(evt) {
  if (evt.detail === "1") {
    render();
  } else {
    render(3);
  }
}
render();