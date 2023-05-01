(() => {

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
    class CustomUsers extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({
                mode: 'open'
            });
            const wrapper = document.createElement("div");
            wrapper.setAttribute("class", "wrapper");
            const style = document.createElement('style');
            style.textContent = ` 
.wrapper {
    padding: 0 16px;
}
.item{
  border-top: 1px solid #e8eaed;
  display: block;
  padding: 12px 0;
  display: flex;
  -webkit-box-orient: horizontal;
  flex-direction: row;
}

.left {
  flex-grow: 1;
}

.right {
  border: none;
  border-radius: 8px;
  object-fit: cover;
  align-self: end;
  margin-left: 16px;
  height: 92px;
  width: 92px;
}

.top {
  -webkit-box-orient: horizontal;
  flex-direction: row;
  color: #5f6368;
  display: flex;
  flex-wrap: wrap;
  letter-spacing: .01428571em;
  font-family: Roboto, Arial, sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
}

.bottom {
  letter-spacing: .00625em;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  color: #202124;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  padding-top: 8px;
}

.top-left {
  font-weight: 500;
}

.top-left:after {
  content: "\\0000a0\\002022\\0000a0";
  padding-right: 8px;
  padding-left: 6px;
}

.top-right {
  display: inline-flex;
}`;
            this.wrapper = wrapper;
            this.shadowRoot.append(style, wrapper);
        }
        navigate(e) {
            this.dispatchEvent(new CustomEvent('submit', {
                detail: e.currentTarget.dataset.href
            }));
        }
        set data(value) {
            this.wrapper.innerHTML = '';
            value.map((element, index) => {
                const wrapper = document.createElement('div');
                wrapper.setAttribute("class", "item");
                this.wrapper.appendChild(wrapper);
                const left = document.createElement('div');
                left.setAttribute("class", "left");
                wrapper.appendChild(left);
                const top = document.createElement('div');
                top.setAttribute("class", "top");
                left.appendChild(top);
                const topLeft = document.createElement('div');
                topLeft.setAttribute("class", "top-left");
                top.appendChild(topLeft);
                topLeft.textContent = `已约 ${element.booked} 次`;
                const topRight = document.createElement('div');
                topRight.setAttribute("class", "top-right");
                top.appendChild(topRight);
                topRight.textContent = `${element.lasted ? timeAgo(element.lasted * 1000) : '未约课'}`;
                const bottom = document.createElement('div');
                bottom.setAttribute("class", "bottom");
                left.appendChild(bottom);
                bottom.textContent = `${element.nick_name}`;
                const img = document.createElement('img');
                img.className = 'right';
                img.src = element.avatar_url;
                wrapper.appendChild(img);
                wrapper.addEventListener('click', () => {
                    window.location = `./user?id=${element.id}`;
                });
            })
        }

        connectedCallback() {
        }
        static get observedAttributes() {
            return ['title'];
        }
        attributeChangedCallback(name, oldValue, newValue) {
        }
    }
    customElements.define('custom-users', CustomUsers);
    /*
    <!--
    <script src="custom-users.js"></script>
    <custom-users bind="customUsers" @submit="onCustomUsersSubmit"></custom-users>
    customElements.whenDefined('custom-users').then(() => {
      customUsers.data = []
    })
    function onCustomActionsSubmit(evt) {
      console.log(evt.detail);
    }
    -->
    */
})();
