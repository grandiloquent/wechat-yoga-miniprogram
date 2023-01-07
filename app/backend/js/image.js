
async function drawPicture() {
    const results = await htmlToImage.toJpeg(picture);
    const a = document.createElement('a');
    a.download = 'picture.jpg';
    a.href = results;
    a.click();
    toast.setAttribute('message', '课表已下载');
}
//drawPicture();

async function downloadData() {
    let baseUri = window.location.host === '127.0.0.1:5500' ? SETTINGS.host : '';
    try {
        const response = await fetch(`${baseUri}/v1/admin/weeks`, {
            headers: {
                "Authorization": window.localStorage.getItem("Authorization")
            }
        });
        if (response.status > 399 || response.status < 200) {
            throw new Error(`${response.status}: ${response.statusText}`)
        }
        const results = await response.text();
        console.log(results);
    } catch (error) {
        console.log(error);
    }
}
downloadData();
