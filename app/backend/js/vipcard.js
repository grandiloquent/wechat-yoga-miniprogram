let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
let cards;
const id = new URL(document.URL).searchParams.get('id');

const userId = new URL(document.URL).searchParams.get('userId') || 1;

async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/card?action=1`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.json();
}
async function render() {
  //if (!id) return;
  if (!userId) return;
  try {
    const response = await fetch(`${baseUri}/v1/admin/user?id=${userId}`, {
      headers: {
        "Authorization": window.localStorage.getItem("Authorization")
      }
    });
    const obj = await response.json();
    userInput.value = obj.nick_name;
  } catch (error) {
    console.log(error);
  }
  let obj;
  try {
    obj = await loadData();
    cards = obj.map(element => element.title);
    cardIdActionSheet.data = cards;
    nameInput.value = obj.name;
  } catch (error) {}
}
render();

function onCardIdInput(evt) {
  cardIdActionSheet.removeAttribute('style');
}
async function onCardIdActionSheet(evt) {
  cardIdInput.value = cards[evt.detail]
}
async function onStartDateInput() {
  startDateDatePicker.removeAttribute('style');
}
async function onStartDateDatePicker(evt) {
  startDateInput.value = dateString(evt.detail);
  startDateInput.dataset.value = evt.detail
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

function dateString(ms) {
  const date = new Date(ms);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};