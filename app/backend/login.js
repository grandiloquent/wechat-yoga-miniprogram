
const phoneNumber = document.querySelector('[name=phone_number]');
const baseUri = window.location.host === '127.0.0.1:5500' ? 'http://127.0.0.1:8081' : '';

phoneNumber.addEventListener('click', evt => {
    evt.stopPropagation();
});

const password = document.querySelector('[name=password]');
password.addEventListener('click', evt => {
    evt.stopPropagation();
});
async function submitUserInformation(data) {
    const response = await fetch(`${baseUri}/v1/admin/login`, {
        method: 'POST',
        body: data
    });
    return await response.text();
}
function collectUserInformation() {
    const data = new FormData();
    data.append('phone_number', phoneNumber.value);
    data.append('password', password.value);
    return data;
}
function cacheLoginToken(token) {
    window.localStorage.setItem("Authorization", token)
}
const button = document.querySelector('.button');
button.addEventListener('click', async evt => {
    evt.stopPropagation();
    try {
        const data = collectUserInformation();
        const obj = await submitUserInformation(data);
        cacheLoginToken(obj)
        document.getElementById('toast').setAttribute('message', '成功');
    } catch (error) {
        document.getElementById('toast').setAttribute('message', `错误${error.messaage}`);
        console.log(error);
    }
});
