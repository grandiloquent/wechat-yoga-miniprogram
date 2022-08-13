//sliders[1].style.transform = 'translateY(0)'
// let up = 0;
// setInterval(() => {
//     if (up === 0) {
//         sliders[0].style = 'transition-duration: 500ms;transform:translateY(-100%)'
//         sliders[1].style = 'transition-duration: 500ms;transform:translateY(-100%)'
//         sliders[2].style = 'transform:translateY(-100%)'
//     } else if (up === 1) {
//         sliders[0].style = 'transform:translateY(100%)'
//         sliders[1].style = 'transition-duration: 500ms;transform:translateY(-200%)'
//         sliders[2].style = 'transition-duration: 500ms;transform:translateY(-200%)'
//     } else {
//         sliders[0].style = 'transition-duration: 500ms;transform:translateY(0%)'
//         sliders[1].style = 'transform:translateY(100%)'
//         sliders[2].style = 'transition-duration: 500ms;transform:translateY(-300%)'
//     }
//
//     setTimeout(()=>{
//         up++;
//         if (up > 2) {
//             up = 0;
//         }
//     },500)
//
// }, 3000)
let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';

// http://localhost:8080
const swipeContainer = document.querySelector('#swipe-container');
swipeContainer.addEventListener('click', evt => {
    evt.stopPropagation();
});
//initializeScrollbar();
initialize();
renderTeachers();
renderMarketing();
renderingNotice();

// --------------------------------
function adjustSwipeHeight(img) {
    img.onload = (evt) => {
        requestAnimationFrame(() => {
            if (img.getBoundingClientRect().height > 1)
                swipeContainer.style.height = img.getBoundingClientRect().height + 'px';
        })
    }
}
/*
async function initializeScrollbar() {
    const sliders = document.querySelectorAll('#slider div');
    sliders[0].style.top = '0';
    let up = 0;
    sliders[0].textContent = await getWeatherInformation();
    const t = new Date();
    const date = calendar.solar2lunar(t.getFullYear(), t.getMonth() + 1, t.getDate());
    sliders[1].textContent = `${date.cMonth}月${date.cDay}日${date.ncWeek}`;
    sliders[2].textContent = `农历${date.IMonthCn}${date.IDayCn}`
    let tx = parseInt(await getBeijingInformation())
    const n = new Date(t);
    sliders[3].textContent = `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`;
    setInterval(() => {
        tx += 1000;
        const n = new Date(tx);
        sliders[3].textContent = `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`;
    }, 1000);
    setInterval(() => {
        if (up === 0) {
            sliders[0].style = 'transition-duration: 500ms;transform:translateY(-200%)'
            sliders[1].style = 'transition-duration: 500ms;transform:translateY(-100%)'
            sliders[2].style = 'transform:translateY(100%)'
            sliders[3].style = 'transform:translateY(100%)'
        } else if (up === 1) {
            sliders[0].style = 'transform:translateY(100%)'
            sliders[1].style = 'transition-duration: 500ms;transform:translateY(-200%)'
            sliders[2].style = 'transition-duration: 500ms;transform:translateY(-100%)'
            sliders[3].style = 'transform:translateY(100%)'
        } else if (up === 2) {
            sliders[0].style = 'transform:translateY(100%)'
            sliders[1].style = 'transform:translateY(100%)'
            sliders[2].style = 'transition-duration: 500ms;transform:translateY(-200%)'
            sliders[3].style = 'transition-duration: 500ms;transform:translateY(-100%)'
        } else {
            sliders[0].style = 'transition-duration: 500ms;transform:translateY(-100%)'
            sliders[1].style = 'transform:translateY(100%)'
            sliders[2].style = 'transform:translateY(100%)'
            sliders[3].style = 'transition-duration: 500ms;transform:translateY(-200%)'
        }
        setTimeout(() => {
            up++;
            if (up > 3) {
                up = 0;
            }
        }, 500)
    }, 3000)
}
*/


async function getConfiguration() {
    const res = await fetch(`${baseUri}/api/configs`);
    return res.json()
}

function renderSlideshow(slideshows) {
    const parent = swipeContainer.querySelector('div');
    let first = true;
    const indicators = document.getElementById('indicators');
    indicators.addEventListener('click', evt => {
    });
    slideshows.forEach((x, k) => {
        const img = document.createElement('img');
        img.src = `https://static.lucidu.cn/images/${x.image}`;
        img.style.maxWidth = '100%';
        img.style.float = 'left';
        img.style.position = 'relative'
        parent.appendChild(img);
        if (first) {
            adjustSwipeHeight(img);
            first = !first;
        }
        const div = document.createElement('div');
        div.dataset.index = k;
        div.innerHTML = `<div style="background: rgba(0,0,0,.35);width: 12px;border-radius: 50%;height: 12px;margin-right: 12px"></div>`;
        indicators.appendChild(div);
    })
    const dots = [...indicators.querySelectorAll('div[data-index]>div')];
    dots[0].style.background = '#fff';
    new Swipe(swipeContainer, {
        startSlide: 0,
        speed: 400,
        auto: 3000,
        continuous: true,
        disableScroll: false,
        stopPropagation: false,
        callback: function (index, elem) {
            dots.forEach((x, k) => {
                if (k === index)
                    x.style.background = '#fff';
                else
                    x.style.background = 'rgba(0,0,0,.35)';
            });
        },
        transitionEnd: function (index, elem) {
        }
    })
}

async function initialize() {
    const data = await getConfiguration();
    renderSlideshow(data.slideshows);
    renderFunctions(data.functions)
}

function renderFunctions(functions) {
    const funcs = document.querySelector('#functions');
    const customSheet = document.querySelector('custom-sheet');
    customSheet.setAttribute('data', JSON.stringify(functions));
    // functions.forEach((x, k) => {
    //     const div = document.createElement('div');
    //     //div.style='display:flex;align-items:center;justify-content:center';
    //     div.innerHTML = `<div style="width: 70px;text-align: center;display: inline-block;overflow: hidden;">
    //         <div style="width: 100%;margin-top: 10px;overflow: hidden;">
    //             <img style="width: 50px;height: 50px" src="https://static.lucidu.cn/images/${x.image.replaceAll(/^.+images\//g, '')}">
    //             <div style="font-size: 12px;text-align: center;">
    //                 ${x.name}
    //             </div>
    //         </div>
    //     </div>`;
    //     div.addEventListener('click', evt => {
    //         if (k === 0)
    //             window.location = './encyclopedias';
    //         else if (k === 4)
    //             window.location = './photos';
    //     })
    //     funcs.appendChild(div);
    // })
}

async function renderTeachers() {
    const res = await fetch(`${baseUri}/api/coach?mode=1`)
    const data = (await res.json()).sort(() => Math.random() - 0.5);
    const teachers = document.querySelector('#teachers');
    data.forEach(x => {
        const template = `<div style="width: 100px;display: flex;align-items: center;flex-direction: column;border-right: 0.5px solid #dadce0;padding: 12px 18px;flex-shrink: 0;">
            <img style="width: 80px;height: 80px;border-radius: 50%;"
                 src="https://static.lucidu.cn/images/${x.thumbnail}">
            <div style="display: flex;align-items: center;font-size: 12px;margin-top: 12px;">
                <div style="display: -webkit-box;-webkit-box-orient: vertical;overflow: hidden;-webkit-line-clamp: 1;text-overflow: ellipsis;">
                ${x.name}
                </div>
                <div style="color: #749b15;flex-shrink: 0;">
                    （私教）
                </div>
            </div>
            <div style="font-size: 12px;margin-top: 12px;display: -webkit-box;-webkit-box-orient: vertical;max-height: 2.5em;-webkit-line-clamp: 2;overflow: hidden;line-height: 1.25;text-overflow: ellipsis;">
                ${x.introduction}
            </div>
        </div>`;
        const div = document.createElement('div');
        div.innerHTML = template;
        div.addEventListener('click',evt=>{
            window.location=`/teacher?id=${x.id}`
        })
        teachers.appendChild(div);
    })
}

async function renderMarketing() {
    const response = await fetch(`${baseUri}/api/reservation?mode=4`);
    const sliders = [];
    const obj = await response.json();
    obj.forEach(x => {
        const div = document.createElement('div');
        div.innerHTML = `    <div style="display: flex;align-items: center;">
        <img style="height: 48px;width: 48px;border-radius: 50%;flex-shrink: 0;"
             src="${x.avatar_url}">
        <div style="-webkit-box-orient: vertical;color: #202124;display: -webkit-box;font-size: 16px;line-height: 20px;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;margin: 0 8px 0 16px;flex-grow: 1;">
        ${x.nick_name}已预约课程
        </div>
        <div style="flex-shrink: 0;border: 1px solid #dadce0;font-size: 14px;line-height: 32px;height: 32px;border-radius: 30px;padding: 0 16px;">
            预约课程
        </div>
    </div>`;
        sliders.push(div);
        market.appendChild(div);
    });
    let max = obj.length;
    sliders[0].style.top = '0';
    let up = 0;
    setInterval(() => {
        sliders.forEach((x, k) => {
            if (up < max - 1) {
                if (k === up) {
                    x.style = 'transition-duration: 500ms;transform:translateY(-200%)'
                } else if (k === up + 1) {
                    x.style = 'transition-duration: 500ms;transform:translateY(-100%)'
                } else {
                    x.style = 'transform:translateY(100%)'
                }
            } else {
                if (k === 0) {
                    x.style = 'transition-duration: 500ms;transform:translateY(-100%)'
                } else if (k === max - 1) {
                    x.style = 'transition-duration: 500ms;transform:translateY(-200%)'
                } else {
                    x.style = 'transform:translateY(100%)'
                }
            }
        })
        setTimeout(() => {
            up++;
            if (up > max - 1) {
                up = 0;
            }
        }, 500)
    }, 3000)
}

async function renderingNotice() {
    const response = await fetch(`${baseUri}/api/notice?mode=1`);
    const obj = await response.json();
    const notice = document.getElementById('notice');
    obj.forEach((x, k) => {

        const t = new Date(x.updated_time * 1000);
        const div = document.createElement('div');
        div.setAttribute("style", "font-size: 14px;display: flex;justify-content: space-between;margin: 6px 0;");
        document.body.appendChild(div);
        const div1 = document.createElement('div');
        div1.setAttribute("style", "display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;overflow: hidden;");
        div.appendChild(div1);
        div1.textContent = `${x.title}`;
        const div2 = document.createElement('div');
        div2.setAttribute("style", "color: #ccc;flex-shrink: 0;");
        div.appendChild(div2);
        div2.textContent = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${(t.getDate() + 1).toString().padStart(2, '0')}`;

        div.addEventListener('click', evt => {
            window.location = `./notice?id=${x.id}`;
        })
        notice.appendChild(div);
    })
}

document.querySelector('.gift-button').addEventListener('click',evt=>{
    window.location = './gift';
})

fetch(`${baseUri}/api/accessRecords?path=${encodeURIComponent(window.location.pathname)}&query=${encodeURIComponent(window.location.search)}`);