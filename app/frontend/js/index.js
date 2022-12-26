function timeSpan(atime, btime) {
  var milliseconds = +(btime || new Date()) - +atime;
  var seconds = ~~(milliseconds / 1000);
  var minutes = ~~(milliseconds / (1 * 60 * 1000));
  var hours = ~~(milliseconds / (1 * 60 * 60 * 1000));
  var days = ~~(milliseconds / (1 * 24 * 60 * 60 * 1000));
  var years = ~~(days / 365.5);
  return {
    years,
    days,
    hours,
    minutes,
    seconds,
    milliseconds
  };
}

function timeAgo(time, locales = 'zh') {
  const ts = timeSpan(time);
  if (!i18n[locales]) locales = 'zh';
  if (ts.seconds < 60) return i18n[locales].justNow;
  if (ts.minutes < 60) return ts.minutes + ' ' + i18n[locales].minutesAgo;
  if (ts.hours < 24) return ts.hours + ' ' + i18n[locales].hoursAgo;
  if (ts.days < 7) return ts.days + ' ' + i18n[locales].daysAgo;
  if (ts.days < 30) return ~~(ts.days / 7) + ' ' + i18n[locales].weeksAgo;
  if (ts.years < 1) return ~~(ts.days / 30) + ' ' + i18n[locales].monthsAgo;
  return ts.years + ' ' + i18n[locales].yearsAgo;
}

const i18n = {
  zh: {
    justNow: '刚刚',
    minutesAgo: '分钟前',
    hoursAgo: '小时前',
    daysAgo: '天前',
    weeksAgo: '周前',
    monthsAgo: '个月前',
    yearsAgo: '年前',
  },
  en: {
    justNow: 'just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    weeksAgo: 'weeks ago',
    monthsAgo: 'months ago',
    yearsAgo: 'years ago',
  },
};

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : '';
async function loadData() {
  const response = await fetch(`${baseUri}/v1/admin/notes`);
  return response.json();
}
async function render() {
  const
    wrapper = document.querySelector('.items');
  let obj;
  try {
    obj = await loadData();
    obj.forEach(value => {
      const item = document.createElement('div');
      item.setAttribute("class", "item");

      const itemTitle = document.createElement('div');
      itemTitle.textContent = value.title;
      itemTitle.setAttribute("class", "item-title");

      item.appendChild(itemTitle);

      const itemSubtitle = document.createElement('div');
      itemSubtitle.textContent = timeAgo(new Date(value.updated_time * 1000));
      itemSubtitle.setAttribute("class", "item-subtitle");
      item.appendChild(itemSubtitle);

      wrapper.appendChild(item);

      item.addEventListener('click', evt => {
        window.location = `/article?id=${encodeURIComponent(value.name)}`;
      });
    })
  } catch (error) {
    console.log(error);
  }
}
render();

function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}
document.querySelectorAll('[bind]').forEach(element => {
  if (element.getAttribute('bind')) {
    window[element.getAttribute('bind')] = element;
  }
  [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
    if (!attr.value) return;
    element.addEventListener(attr.nodeName.slice(1), evt => {
      window[attr.value](evt);
    });
  });
})
