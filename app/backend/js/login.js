const baseUri = window.location.host === '127.0.0.1:5500' ? 'http://127.0.0.1:8081' : '';

phone_number.addEventListener('click', evt => {
  evt.stopPropagation();
});


async function submitUserInformation(data) {
  const response = await fetch(`${baseUri}/v1/login`, {
    method: 'POST',
    body: data
  });
  return await response.text();
}

function collectUserInformation() {
  const data = new FormData();
  data.append('phone_number', phone_number.value);
  data.append('password', password.value);
  return data;
}

function cacheLoginToken(token) {
  window.localStorage.setItem("Authorization", token)
}

async function submit(evt) {
  evt.stopPropagation();
  try {
    const data = collectUserInformation();
    const obj = await submitUserInformation(data);
    cacheLoginToken(obj)
    toast.setAttribute('message', '成功');
  } catch (error) {
    toast.setAttribute('message', `错误${error.messaage}`);
    console.log(error);
  }
}