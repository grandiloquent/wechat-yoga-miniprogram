/*
let baseUri = "";
let selected, todayIndex, selectedDateTime;
const dates = document.getElementById('dates');

function render(offset) {
    selected = 0;
    dates.innerHTML = '';
    const obj = getDates(offset || 0);
    const elements = [];
    obj.forEach((x, k) => {
        const div = document.createElement('div');
        let style = '';
        if (k === 0) {
            style = "border-top-left-radius: 4px;border-bottom-left-radius: 4px;";
        } else if (k === obj.length - 1) {
            style = "border-top-right-radius: 4px;border-bottom-right-radius: 4px;";
        }
        div.dataset.index = k;
        div.innerHTML = `<div style="width: 100%;display: flex;flex-direction: column;align-items: center;padding: 6px 0;background: #f3f3f3;${style}">
            <span>${x.week}</span>
            <div style="font-size: 18px;padding: 4px 0;">
                ${x.day}
            </div>
            <span>${x.month + 1}月</span>
        </div>`;
        div.dataset.time = x.time;
        elements.push(div);
        dates.appendChild(div);
        div.addEventListener('click', evt => {
            evt.stopPropagation();
            selectedDateTime = parseInt(evt.currentTarget.dataset.time)
            const idx = parseInt(evt.currentTarget.dataset.index);
            elements.forEach((v, j) => {
                if (j == idx) {
                    const d = v.querySelector('div');
                    d.style.background = '#749b15';
                    d.style.color = '#fff';
                } else {
                    const d = v.querySelector('div');
                    d.style.background = '#f3f3f3';
                    d.style.color = '#030303';
                }
            });
            loadData()
        });
    });
    const d = document.querySelector(`#dates>div[data-index='${selected}']>div`);
    d.style.background = '#749b15';
    d.style.color = '#fff';
}

render();
const nextWeek = document.getElementById('next-week');
const week = document.getElementById('week');
nextWeek.addEventListener('click', evt => {
    render(7);
    nextWeek.style.backgroundColor = '#e8f0fe';
    nextWeek.style.color = '#1967d2';
    week.style.backgroundColor = '#fff';
    week.style.color = ' #030303';
    loadData()
});
week.addEventListener('click', evt => {
    render(0);
    week.style.backgroundColor = '#e8f0fe';
    week.style.color = '#1967d2';
    nextWeek.style.backgroundColor = '#fff';
    nextWeek.style.color = ' #030303';
    loadData()
});
const items = document.getElementById('items');
const empty = document.getElementById('empty');

async function loadData() {
    const startTime = selectedDateTime;
    const id = new URL(window.location).searchParams.get('id');
    const response = await fetch(`${baseUri}/api/reservation?mode=1&id=0&startTime=${startTime || 0}&endTime=0&classType=4`);
    items.innerHTML = "";
    let obj = {};
    try {
        obj = await response.json();
    } catch (e) {
        empty.style.display = "flex";
        return;
    }
    empty.style.display = 'none';
    setLessonStatus(obj, 3, 60);
console.log(obj.sort((x, y) => {
    console.log(x.start_time,y.start_time)
    return x.start_time-y.start_time
}));
    obj.sort((x, y) => {
        return x.start_time - y.start_time
    }).forEach(x => {
        console.log(x.mode);
        const div = document.createElement('div');
        let str = '';
        let s1 = '';
        if (x.mode & 16) {
            str = `
<div style="position: absolute;padding:16px 16px 16px 17px;font-size: 15px;right: -16px;bottom: 0px;color: #70757a;">
准备上课
</div>`
        }
        if (x.mode & 8) {
            str = `<div style="color: #1558d6; position: absolute; padding: 16px 16px 16px 17px; font-size: 15px; right: -16px; bottom: 0;">
          预约
        </div>`
            s1 = `已预约 0/${x.peoples}`
        }
        if (x.mode & 4) {
            s1 = `${x.teacher_name}`;
        }
        if (x.mode & 1) {
            str = `
<div style="position: absolute;padding:16px 16px 16px 17px;font-size: 15px;right: -16px;bottom: 0px;color: #70757a;">
已完成
</div>`
        }

      
          div.innerHTML = `
          <div style="color: #202124; display: flex; background-color: #fff; margin: 0 0 10px 0; border-radius: 8px; flex-grow: 1; box-shadow: 0 0 0 1px #ebedef; padding-left: 16px; padding-right: 16px;">
            <div style="display: flex; justify-content: center; margin: 16px 16px 16px 0;">
              <img style="overflow: hidden; position: relative; border-radius: 8px; background-color: #f8f9fa; height: 92px; width: 92px;" src="https://static.lucidu.cn/images/${x.thumbnail}" />
            </div>
            <div style="flex-grow: 1; width: 0; position: relative; padding: 16px 0 40px;">
              <div style="font-size: 12px; font-weight: 400; line-height: 16px; overflow: hidden; text-align: left; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 8px; display: flex; justify-content: space-between;">
                <span>
                  ${((x.start_time) / 3600) | 0}:${(((x.start_time % 3600) / 60) | 0).toString().padStart(2, '0')}
                </span>
                <div style="color: #70757a;">
                  ${x.teacher_name}
                </div>
              </div>
              <div style="display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; white-space: normal; -webkit-line-clamp: 3;">
                ${x.lesson_name}
              </div>
              <div style="overflow: hidden; text-overflow: ellipsis; color: #70757a; line-height: 16px; position: absolute; width: calc(100% - 32px); padding: 0 16px; font-size: 12px; left: -16px; bottom: 16px;">
               ${s1}
              </div>
              ${str}
            </div>
          </div>
        `;
              items.appendChild(div);
          });
      }
      
      loadData();
      items.addEventListener('click', evt => {
      });
      
      function getDates(offset = 0) {
          const dates = [];
          const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          let today = new Date();
          today.setHours(0, 0, 0, 0);
          let todayDateTimestamp = today.getTime();
          let start = calculateStartTimestamp(todayDateTimestamp, today.getDay());
          for (let index = 0; index < 7; index++) {
              const timestamp = new Date((start + 86400 * (index + offset)) * 1000);
              if (index === 0) {
                  selectedDateTime = timestamp.getTime() / 1000
              }
              if (todayDateTimestamp === timestamp.getTime()) {
                  selected = index;
                  todayIndex = index;
                  selectedDateTime = timestamp.getTime() / 1000
              }
              dates.push({
                  id: index,
                  week: todayDateTimestamp === timestamp.getTime() ? '今日' : weeks[timestamp.getDay()],
                  day: timestamp.getDate(),
                  month: timestamp.getMonth(),
                  time: timestamp / 1000
              })
          }
          return dates;
      }
      
      function calculateStartTimestamp(dateTimestamp, day) {
          if (day === 0) {
              return dateTimestamp / 1000 - 86400 * 6;
          } else {
              return dateTimestamp / 1000 - 86400 * (day - 1);
          }
      }
      
      function setLessonStatus(lessons, throttleHours, minutesLimit) {
          // 128 已满额
          // 64 已签到
          // 32 正在上课
          // 16 准备开课
          // 8 预约
          // 4 签到
          // 2 取消预约
          // 1 已完成
          const now = new Date();
          const currentSeconds = getCurrentSeconds(now);
          now.setHours(0, 0, 0, 0);
          const todayTimestamp = now.getTime() / 1000;
          for (let i = 0; i < lessons.length; i++) {
              // if (i === 1) {
              //   const nn = new Date();
              //   nn.setHours(0, 0, 0, 0);
              //   lessons[i].dateTime = nn.getTime() / 1000;
              //   lessons[i].startTime = parseDuration("14:00")
              //   lessons[i].endTime = lessons[i].startTime + 3600
              //   lessons[i].peoples = 6;
              //   lessons[i].reservationId = 1;
              // }
              if (checkIfLessonExpired(todayTimestamp, lessons[i], currentSeconds)) {
                  continue;
              }
              if (checkIfLessonFullyBooked(todayTimestamp, lessons[i], currentSeconds, minutesLimit)) {
                  continue;
              }
              if (checkIfBooked(todayTimestamp, lessons[i], currentSeconds, minutesLimit, throttleHours)) {
                  continue;
              }
              if (todayTimestamp === lessons[i].date_time) {
                  if (lessons[i].start_time > currentSeconds && lessons[i].start_time - currentSeconds < minutesLimit * 60) {
                      lessons[i].mode = 16;
                      continue;
                  }
                  if (currentSeconds >= lessons[i].start_time && currentSeconds <= lessons[i].end_time) {
                      lessons[i].mode = 32;
                      continue;
                  }
              }
              lessons[i].mode |= 8;
          }
      }
      
      function getCurrentSeconds(now) {
          return now.getHours() * 60 * 60 + now.getMinutes() * 60;
      }
      
      function checkIfLessonExpired(todayTimestamp, lesson, currentSeconds) {
      
          // First check if it is a class before today
          // If it's today's class, check if the current time exceeds the class end time
          if (todayTimestamp > lesson.date_time ||
              (todayTimestamp === lesson.date_time && lesson.end_time <= currentSeconds)) {
              lesson.mode = 1;
              return true;
          }
          return false;
      }
      
      function checkIfLessonFullyBooked(todayTimestamp, lesson, currentSeconds, minutesLimit) {
          if (lesson.count >= lesson.peoples || lesson.peoples < 0) {
              lesson.mode = 128;
              if (todayTimestamp === lesson.dateTime) {
                  if (lesson.startTime > currentSeconds &&
                      lesson.startTime - currentSeconds < minutesLimit * 60) {
                      lesson.mode = 16;
                  } else if (currentSeconds >= lesson.startTime && currentSeconds <= lesson.endTime) {
                      lesson.mode = 32;
                  }
                  // if (today && lesson.reservedId && lesson.fulfill !== 1) {
                  //   lesson.mode |= 4;
                  // }
              }
              return true;
          }
          return false;
      }
      
      function checkIfBooked(todayTimestamp, lesson, currentSeconds, minutesLimit, throttleHours) {
          if (lesson.reservation_id) {
              if (todayTimestamp < lesson.date_time) {
                  lesson.mode = 2
                  return true;
              }
              if (lesson.start_time - currentSeconds > throttleHours * 60) {
                  lesson.mode = 2
              }
              if (lesson.fulfill === 1) {
                  lesson.mode |= 64;
              } else {
                  lesson.mode |= 4;
              }
              if (lesson.start_time > currentSeconds && lesson.start_time - currentSeconds < minutesLimit * 60) {
                  lesson.mode |= 16;
              }
              if (currentSeconds >= lesson.start_time && currentSeconds <= lesson.end_time) {
                  lesson.mode |= 32;
              }
              return true;
          }
          return false;
      }
      
      fetch(`/api/accessRecords?path=${encodeURIComponent(window.location.pathname)}&query=${encodeURIComponent(window.location.search)}`, {method: 'HEAD'});
*/

let baseUri = window.location.hostname === 'localhost' ? 'http://localhost:9000' : '';

// http://localhost:9000
let userId = new URL(window.location).searchParams.get('userId') || getCookie("UserId");

let id = new URL(window.location).searchParams.get('id');
let items = document.getElementById('items');
const empty = document.getElementById('empty');
let startTime = new Date().setHours(0, 0, 0, 0) / 1000;
let offset = 7;

render();

const customWeekTab = document.querySelector('custom-week-tab');
const select = new Date().getDay() - 1;
customWeekTab.setAttribute('select', select === -1 ? 6 : select)
customWeekTab.addEventListener('touch', async evt => {
    const now = new Date();
    now.setDate(now.getDate() + evt.detail + offset - (select === -1 ? 6 : select));
    startTime = now.setHours(0, 0, 0, 0) / 1000;
    await render()
});

const customSwitcher = document.querySelector('custom-switcher');
customSwitcher.addEventListener('touch', async evt => {
    customWeekTab.setAttribute('select', 0);
    if (evt.detail === 0) {
        startTime = new Date().setHours(0, 0, 0, 0) / 1000;
        offset = 0;
        await render();

    } else {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        startTime = now.setHours(0, 0, 0, 0) / 1000;
        offset = 7;
        await render()
    }
});

//------------------------------------------------------


async function executeBooking(evt) {
    if (evt.detail.mode === 1) {
        if (evt.detail.mode === 1) {
            try {
                const res = await booking(evt.detail.course_id, userId);
                const resultCode = parseInt(res);
                if (resultCode < 0) {

                    if (resultCode == -101)
                        throw new Error('请购买会员卡');
                    else if (resultCode == -102 || resultCode == -104)
                        throw new Error('课程已过期');
                    else
                        throw new Error('无法预约');
                }
                render(startTime);
            } catch (e) {
                document.getElementById('toast').setAttribute('message', e.message);
            }
        }
    }
}

function executeUnBooking(evt) {
    if (evt.detail.mode === 2) {
        const customDialog = document.createElement('custom-dialog');
        const div = document.createElement('div');
        div.textContent = '您确定要取消预约吗？'
        customDialog.appendChild(div);
        customDialog.addEventListener('submit', async ev => {
            try {
                await unBooking(evt.detail.reservation_id);
                render(startTime);
            } catch (e) {
                document.getElementById('toast').setAttribute('message', '无法预约');
            }
        })
        document.body.appendChild(customDialog);

    }
}

async function loadData(startTime) {
    const response = await fetch(`${baseUri}/api/reservation.query.today?userId=${userId}&startTime=${startTime || 0}&classType=4`);
    return response.json();
}

async function render() {
    items.innerHTML = '';
    try {
        const obj = await loadData(startTime);
        empty.style.display = 'none';
        const g = groupByKey(obj, 'date_time');
        for (const key in g) {
            const customItemHeader = document.createElement('custom-item-header');
            customItemHeader.setAttribute('date', key);
            g[key].sort((x, y) => {
                return x.start_time - y.start_time
            }).forEach(x => {
                const customItem = document.createElement('custom-item');
                customItem.setAttribute('data', JSON.stringify(x));
                customItem.addEventListener('touch', async evt => {
                    await executeBooking(evt);
                    await executeUnBooking(evt);
                })
                customItemHeader.appendChild(customItem);
            });
            items.insertAdjacentElement('afterbegin', customItemHeader);
        }
    } catch (e) {
        empty.style.display = 'flex';
    }
}

