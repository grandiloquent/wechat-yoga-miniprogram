

async function getWeatherInformation() {
    const res = await fetch(`${baseUri}/api/weather`);
    const obj = (await res.json()).data.observe;
    return "长沙市" + obj['weather'] + obj['degree'] + '°' + {
        "0": "微风",
        "1": "东北风",
        "2": "东风",
        "3": "东南风",
        "4": "南风",
        "5": "西南风",
        "6": "西风",
        "7": "西北风",
        "8": "北风",
        "9": "旋转风"
    } [obj['wind_direction']] + obj['wind_power'] + "级"
}

// https://localhost:8080
async function getBeijingInformation() {
    const res = await fetch(`${baseUri}/api/beijing`);
    const obj = (await res.json()).data.t;
    return obj;
}
class CustomNews extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({mode: 'open'});
        this.container = document.createElement('div');
        this.root.appendChild(this.container);

        this.container.innerHTML = CustomNews.template();


    }


    static get observedAttributes() {
        return ['text'];
    }


   async connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        const items = this.root.querySelectorAll('.item')
        let f = 0;
        this.duration = 300;
        items[0].textContent=await getWeatherInformation();

       const t = new Date();
       const date = calendar.solar2lunar(t.getFullYear(), t.getMonth() + 1, t.getDate());
       items[1].textContent = `${date.cMonth}月${date.cDay}日${date.ncWeek}`;
       items[2].textContent = `农历${date.IMonthCn}${date.IDayCn}`
       let tx = parseInt(await getBeijingInformation())
       const n = new Date(t);
       items[3].textContent = `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`;
       setInterval(() => {
           tx += 1000;
           const n = new Date(tx);
           items[3].textContent = `北京时间${n.getHours()}点${n.getMinutes()}分${n.getSeconds()}秒`;
       }, 1000);

       /*
       const x = `transform:translateX(100%);`;
       const y = `transform:translateX(-100%);transition:transform ${this.duration}ms linear;`;
       const z = `transform:translateX(0%);transition:transform ${this.duration}ms linear;`
        */

       const x = `transform:translateY(100%);`;
       const y = `transform:translateY(-100%);transition:transform ${this.duration}ms linear;`;
       const z = `transform:translateY(0%);transition:transform ${this.duration}ms linear;`
       items[0].style = `transform:translateX(0);`

       requestAnimationFrame(() => {

           setInterval(() => {

               if (f === 0) {
                   items[0].style = y
                   items[1].style = z
                   items[2].style = x
                   items[3].style = x
               } else if (f === 1) {
                   items[0].style = x
                   items[1].style = y
                   items[2].style = z
                   items[3].style = x
               } else if (f === 2) {
                   items[0].style =x
                   items[1].style =x
                   items[2].style = y
                   items[3].style = z
               } else {
                   items[0].style = z
                   items[1].style = x
                   items[2].style = x
                   items[3].style = y
               }


               setTimeout(() => {

                   // if (f === 0) {
                   //     items[1].style = transform:translateX(100%);
                   //     //items[1].style = 'position: absolute;transform:translateX(100%);width: 100%'
                   // } else if (f === 1) {
                   //     //items[0].style = 'position: absolute;transform:translateX(100%);width: 100%'
                   //     items[0].style = 'transform:translateX(100%);'
                   // } else if (f === 2) {
                   //     //items[0].style = 'position: absolute;transform:translateX(100%);width: 100%'
                   //     items[1].style = 'transform:translateX(100%);'
                   // } else {
                   //     items[0].style = `transform:translateX(100%);'
                   // }
                   f++;
                   if (f > 3) {
                       f = 0;
                   }

                   // items[1].style = 'position: absolute;transform:translateX(200%);width: 100%'
                   // if (f){
                   //     items[0].style = 'position: absolute;transform:translateX(100%);width: 100%'
                   //     items[1].style = 'position: absolute;transform:translateX(200%);width: 100%'
                   // }else {
                   //     items[0].style = 'position: absolute;transform:translateX(100%);width: 100%'
                   //     items[1].style = 'position: absolute;transform:translateX(200%);width: 100%'
                   // }

               }, this.duration * 2)
           }, this.duration*2+3000)

       })
       //items[1].style = `transform:translateX(0%);transition:transform ${this.duration * 2}ms linear;`



    }

    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'show') {
            this.root.querySelector('.wrapper').style.transform = 'translateX(250px)';
        }
    }

    static template() {
        return `
    <style>
      
            .item{
            position: absolute;
            width: 100%;
            }
            
          
    </style>
    <div style="width: 100%; padding: 0 8px; box-sizing: border-box; display: flex; background: #fff; color: #70757a;">
      <div style="height: 24px; width: 24px;">
        <svg style="height: 18px; width: 18px;margin: 3px 0 0 3px;fill: #70757a"  viewBox="0 0 24 24">
<path d="M15.984 17.016v-6q0-1.922-1.078-3.211t-2.906-1.289-2.906 1.289-1.078 3.211v6h7.969zM18 15.984l2.016 2.016v0.984h-16.031v-0.984l2.016-2.016v-4.969q0-2.344 1.195-4.078t3.305-2.25v-0.703q0-0.609 0.422-1.055t1.078-0.445 1.078 0.445 0.422 1.055v0.703q2.109 0.516 3.305 2.25t1.195 4.078v4.969zM12 21.984q-0.797 0-1.406-0.586t-0.609-1.383h4.031q0 0.797-0.609 1.383t-1.406 0.586z"></path>
</svg>
      </div>
      <div style="height: 24px; line-height: 24px; font-size: 12px; position: relative; overflow: hidden; flex-grow: 1;">
        <div class="item" style="transform: translateY(100%);">
        </div>
        <div class="item" style="transform: translateY(100%);">
        </div>
        <div class="item" style="transform: translateY(100%);">
        </div>
        <div class="item" style="transform: translateY(100%);">
        </div>
      </div>
    </div>
   `;
    }


}

customElements.define('custom-news', CustomNews);
/*
<!--
<script src="news.js"></script>

const customCustomNews = document.querySelector('custom-news');
-->
*/