
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
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

async function render() {
    let results
    try {
        results = await downloadData();
        renderLessons(line1, 32400, results);
        renderLessons(line2, 70200, results);
    } catch (error) {
        console.log(error);
    }
    if (!results) return;
}

function renderLessons(element, start_time, results) {
    element.insertAdjacentHTML('afterend',
        [...new Array(7).keys()].map((value, index) => {
            const obj = results.filter((value) => {
                if (value.start_time !== start_time) {
                    return false;
                }
                const date = new Date(value.date_time * 1000);
                return (date.getDay() === 0 ? 7 : date.getDay()) === index + 1;
            })
            if (!obj.length) {
                return `<div class="item">假日</div>`
            } else {
                return `<div class="item">
            <div style="margin-bottom: 8px;">
               ${obj[0].lesson_name}
            </div>
         <div style="font-size: 18px;">
         ${obj[0].teacher_name}
         </div>
         </div>`
            }
        }).join(''));
}

render();