class CustomItem extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });
        const div = document.createElement('div');
        div.setAttribute("style", "user-select: none;border-top: 1px solid #e8eaed; padding:12px 16px; ");
        this.root.appendChild(div);
        const div1 = document.createElement('div');
        div1.setAttribute("style", "display: flex;");
        div.appendChild(div1);
        const img = document.createElement('img');
        img.setAttribute("style", "width: 92px; height: 92px; margin-right: 16px; border-radius: 8px;");
        div1.appendChild(img);
        const div2 = document.createElement('div');
        div2.setAttribute("style", "flex-grow: 1;");
        div1.appendChild(div2);
        const div3 = document.createElement('div');
        div3.setAttribute("style", "color: #5f6368; font-size: 12px; line-height: 16px; display: flex; align-items: center;");
        div2.appendChild(div3);

        /*
        const div4 = document.createElement('div');
        div3.appendChild(div4);
        const div5 = document.createElement('div');
        div5.setAttribute("style", "font-size: 12px; padding: 0 8px 0 6px; opacity: .6; min-width: 10px; text-align: center;");
        div3.appendChild(div5);
        div5.textContent = `•`;
        */

        const div6 = document.createElement('div');
        div3.appendChild(div6);

        const a = document.createElement('a');
        //a.setAttribute("href", "./lesson?id=${x.course_id}");
        a.setAttribute("style", "color: #202124; font-size: 16px; line-height: 24px; padding-top: 8px;text-decoration: none;");
        div2.appendChild(a);
        //a.textContent = `${x.lesson_name}`;
        const div7 = document.createElement('div');
        div7.setAttribute("style", "display:flex;padding:8px 0 0 0");
        div.appendChild(div7);
        const div8 = document.createElement('div');
        div8.setAttribute("style", "flex-grow:1");
        div7.appendChild(div8);
        const div9 = document.createElement('div');
        div9.style.border = "1px solid #dadce0";
        div9.style.borderRadius = "16px";
        div9.style.color = "#5f6368";
        div9.style.display = "inline-flex";
        div9.style.fontSize = "12px";
        div9.style.height = "24px";
        div9.style.lineHeight = "24px";
        div9.style.padding = "2px 12px";
        div7.appendChild(div9);
        this.img = img;


        this.subtitle = div6;
        this.a = a;
        this.button = div9;
    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const weeks = "日一二三四五六".split('');

            const obj = JSON.parse(newVal);
            //obj.reservation_id = 1;
            // obj.start_time = 8 * 3600;
            // obj.end_time = 9 * 3600;
            this.img.setAttribute("src", `https://static.lucidu.cn/images/${obj.thumbnail}`);

            //this.dateString.textContent = `${date.getMonth() + 1}月${date.getDate()}日周${weeks[date.getDay()]}`;
            this.subtitle.textContent = `${(obj.start_time / 3600) | 0}:${((obj.start_time % 3600 / 60) | 0).toString().padStart(2, '0')}-${(obj.end_time / 3600) | 0}:${((obj.end_time % 3600 / 60) | 0).toString().padStart(2, '0')}`;
            this.a.textContent = `${obj.lesson_name}`;
            this.a.setAttribute('href', `/lesson?id=${obj.course_id}`);

            if (this.checkIfExpired(obj)) {
                return;
            }

            if (this.checkIfBooked(obj)) {
                return;
            }

            this.button.textContent = "预约";
        }
    }

    checkIfExpired(obj) {
        if (obj.hidden === 2) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "已取消";
            return true;
        }
        if (obj.reservation_id) {
            return false;
        }

        const start = obj.date_time + obj.start_time;
        const seconds = (new Date() / 1000 | 0);
        const dif = start - seconds;
        const end = obj.date_time + obj.end_time - seconds;
        if (dif > 0 && dif < 3600) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "准备上课";
            return true;
        } else if (end > 0 && end < 3600) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "正在上课";
            return true;
        } else if (dif <= 0) {
            this.button.style.background = "#f1f3f4";
            this.button.style.color = "#5f6368";
            this.button.textContent = "已完成";
            return true;
        }
        this.button.textContent = "预约";
        this.button.addEventListener("click", evt => {
            this.dispatchEvent(new CustomEvent('touch', {
                detail: {
                    mode: 1,
                    course_id: obj.course_id,
                }
            }))
        })
        return true;
    }

    checkIfBooked(obj) {
        if (!obj.reservation_id) {
            return false;
        }
        const start = obj.date_time + obj.start_time;
        const seconds = (new Date() / 1000 | 0);
        const dif = start - seconds;
        const end = obj.date_time + obj.end_time - seconds;

        if (dif > 3600 * 3) {
            //return false;
            if (obj.peoples >= obj.position) {
                this.button.textContent = "取消候补";
            }
            else
                this.button.textContent = "取消预约";
            this.button.addEventListener("click", evt => {
                this.dispatchEvent(new CustomEvent('touch', {
                    detail: {
                        mode: 2,
                        reservation_id: obj.reservation_id,
                        course_id: obj.course_id
                    }
                }));
            })
            return true;
        } else if (dif > 0 && dif < 3600) {
            this.button.textContent = "准备上课";
        } else if (end > 0 && end < 3600) {
            this.button.textContent = "正在上课";
        } else if (dif <= 0) {
            this.button.textContent = "已完成";
        } else {
            this.button.textContent = "已预约";
        }
        this.button.style.background = "#f1f3f4";
        this.button.style.color = "#5f6368";
        return true;
    }

    checkIfPrepare(obj) {

    }

}

customElements.define('custom-item', CustomItem);
/*
<!--
<script src="components/item.js"></script>
<custom-item></custom-item>
const customCustomItem = document.querySelector('custom-item');
-->
*/