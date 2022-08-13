class CustomSheet extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.wrapper{
            background-color: #fff;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            box-shadow: 0 0 18px 0 rgba(5, 5, 5, 0.15);
            margin: 0 12px;
            border-radius: 10px;
            padding: 10px 0;
            position: inherit;
            justify-items: center
        }`;
        const container = document.createElement('div');
        container.className = 'wrapper';
        this.container = container;
        this.root.appendChild(container);


    }


    static get observedAttributes() {
        return ['data'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    makeItem(x) {
        const div = document.createElement('div');
        div.style.width = "70px";
        div.style.textAlign = "center";
        div.style.display = "inline-block";
        div.style.overflow = "hidden";
        const div1 = document.createElement('div');
        div1.style.width = "100%";
        div1.style.marginTop = "10px";
        div1.style.overflow = "hidden";
        div.appendChild(div1);
        const img = document.createElement('img');
        img.style.width = "50px";
        img.style.height = "50px";
        img.setAttribute("src", `https://static.lucidu.cn/images/${x.image.replaceAll(/^.+images\//g, '')}`);
        div1.appendChild(img);
        const div2 = document.createElement('div');
        div2.style.fontSize = "12px";
        div2.style.textAlign = "center";
        div1.appendChild(div2);
        div2.textContent = `${x.name}`;
        return div;
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
            obj.forEach((x, k) => {
                const v = this.makeItem(x);
                v.addEventListener('click', evt => {
                    if (k === 0) {
                        window.location = './encyclopedias';
                    } else if (k === 1) {
                        window.location = './appointment';
                    } else if (k === 4) {
                        window.location = './photos';
                    } else if (k === 5) {
                        window.location = './gift';
                    } else if (k === 6) {
                        window.location = './notices';
                    }  else if (k === 7) {
                        window.location = './help';
                    } 
                })
                this.container.appendChild(v)
            })
        }
    }

}
customElements.define('custom-sheet', CustomSheet);
/*
<!--\
<custom-sheet></custom-sheet>
<script src="components/sheet.js"></script>
const customSheet = document.querySelector('custom-sheet');
const customSheet = document.createElement('custom-sheet');
customSheet.setAttribute('',JSON.stringify(obj));
-->
*/
class CustomSectionHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.header {
            display: flex;
            align-items: center;
            margin: 16px 0;
            color: #969799;
            font-size: 14px;
            line-height: 24px;
        }`;
        const header = document.createElement('div');
        header.setAttribute("class", "header");
        this.root.appendChild(header);
        const div = document.createElement('div');
        div.style.height = "1px";
        div.style.background = "#ebedf0";
        div.style.marginRight = "16px";
        div.style.flex = "1";
        header.appendChild(div);
        const img = document.createElement('img');
        img.style.width = "20px";
        img.style.height = "20px";
        img.style.marginRight = "9px";
        header.appendChild(img);
        const span = document.createElement('span');
        header.appendChild(span);
        span.textContent = this.title;
        const div1 = document.createElement('div');
        div1.style.height = "1px";
        div1.style.background = "#ebedf0";
        div1.style.flex = "1";
        div1.style.margin = "0 0 0 16px";
        header.appendChild(div1);
        this.img = img;

    }


    static get observedAttributes() {
        return ['src'];
    }


    connectedCallback() {
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'src') {
            this.img.setAttribute("src", newVal);
        }
    }

}
customElements.define('custom-section-header', CustomSectionHeader);
/*
<!--\
<custom-section-header></custom-section-header>
<script src="components/section-header.js"></script>
const customSectionHeader = document.querySelector('custom-section-header');
const customSectionHeader = document.createElement('custom-section-header');
customSectionHeader.setAttribute('',JSON.stringify(obj));
-->
*/
class CustomBottom extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({
            mode: 'open'
        });

        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        document.body.appendChild(wrapper);
        const item = document.createElement('div');
        item.setAttribute("class", "item");
        wrapper.appendChild(item);
        const a = document.createElement('a');
        a.setAttribute("href", "./index");
        a.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");
        item.appendChild(a);
        const img = document.createElement('div');
        img.setAttribute("class", "img");
        item.appendChild(img);
        const img1 = document.createElement('img');
        img1.setAttribute("src", "https://static.lucidu.cn/images/home-off.png");
        img.appendChild(img1);
        const text = document.createElement('div');
        text.setAttribute("class", "text");
        item.appendChild(text);
        text.textContent = "首页";
        const item2 = document.createElement('div');
        item2.setAttribute("class", "item");
        wrapper.appendChild(item2);
        const a3 = document.createElement('a');
        a3.setAttribute("href", "./appointment");
        a3.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");
        item2.appendChild(a3);
        const img4 = document.createElement('div');
        img4.setAttribute("class", "img");
        item2.appendChild(img4);
        const img5 = document.createElement('img');
        img5.setAttribute("src", "https://static.lucidu.cn/images/yueke.png");
        img4.appendChild(img5);
        const text6 = document.createElement('div');
        text6.setAttribute("class", "text");
        item2.appendChild(text6);
        text6.textContent = "约课";
        const item7 = document.createElement('div');
        item7.setAttribute("class", "item");
        wrapper.appendChild(item7);
        const a2 = document.createElement('a');
        a2.setAttribute("href", "./booked");
        a2.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");

        item7.appendChild(a2)

        const img8 = document.createElement('div');
        img8.setAttribute("class", "img");
        item7.appendChild(img8);
        const img9 = document.createElement('img');
        img9.setAttribute("src", "https://static.lucidu.cn/images/check-in.png");
        img8.appendChild(img9);
        const text10 = document.createElement('div');
        text10.setAttribute("class", "text");
        item7.appendChild(text10);
        text10.textContent = "已约";
        const item11 = document.createElement('div');
        item11.setAttribute("class", "item");
        wrapper.appendChild(item11);
        const a5 = document.createElement('a');
        a5.setAttribute("href", "./user");
        a5.setAttribute("style", "position: absolute; top: 0; left: 0; bottom: 0; right: 0; z-index: 1;");

        item11.appendChild(a5)

        const img12 = document.createElement('div');
        img12.setAttribute("class", "img");
        item11.appendChild(img12);
        const img13 = document.createElement('img');
        img13.setAttribute("src", "https://static.lucidu.cn/images/my-off.png");
        img12.appendChild(img13);
        const text14 = document.createElement('div');
        text14.setAttribute("class", "text");
        item11.appendChild(text14);
        text14.textContent = "我的";

        wrapper.insertAdjacentHTML('afterbegin', CustomBottom.style());
        this.root.appendChild(wrapper);

        this.item = item;
        this.item1 = item2;
        this.item2 = item7;
        this.item3 = item11;

    }


    static get observedAttributes() {
        return ['selected'];
    }

    connectedCallback() {
        if (this.selected === '1') {
            this.item.className = 'item active';
            this.item.querySelector('img').src = 'https://static.lucidu.cn/images/home-on.png'
        } else if (this.selected === '2') {
            this.item1.className = 'item active';
            this.item1.querySelector('img').src = 'https://static.lucidu.cn/images/yueke-on.png'
        } else if (this.selected === '3') {
            this.item2.className = 'item active';
            this.item2.querySelector('img').src = 'https://static.lucidu.cn/images/check-in-on.png'
        } else if (this.selected === '4') {
            this.item3.className = 'item active';
            this.item3.querySelector('img').src = 'https://static.lucidu.cn/images/my-on.png'
        }
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'selected') {
            this.selected = newVal;
        }
    }

    static style() {
        return `
        <style>
.wrapper
{
    display: flex;
    justify-content: space-around;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
    z-index: 3;
    height: 48px;
    border-top: 1px solid rgba(0,0,0,.1);
    background: rgba(255,255,255,.98);
    color: #030303;
    font-size: 12px;
}
.text
{
    max-width: 100%;
    padding: 0 4px;
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #030303;
}
.active .text
{
    color: #749b15;
}
.img
{
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    fill: currentColor;
    stroke: none;
    color: #030303;
    display: block;
}
.img>img{
width: 100%;
}
.item
{
    display: flex;
    -webkit-box-flex: 1;
    flex: 1 1 0%;
    min-width: 0;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
}
        </style>`;
    }
}

customElements.define('custom-bottom', CustomBottom);
/*
<!--
<script src="bottom.js"></script>
<custom-bottom></custom-bottom>
const customCustomBottom = document.querySelector('custom-bottom');
-->
*/
/**
 * @1900-2100区间内的公历、农历互转
 * @charset UTF-8
 * @Author  Jea杨(JJonline@JJonline.Cn)
 * @Time    2014-7-21
 * @Time    2016-8-13 Fixed 2033hex、Attribution Annals
 * @Time    2016-9-25 Fixed lunar LeapMonth Param Bug
 * @Time    2017-7-24 Fixed use getTerm Func Param Error.use solar year,NOT lunar year
 * @Version 1.0.3
 * @公历转农历：calendar.solar2lunar(1987,11,01); //[you can ignore params of prefix 0]
 * @农历转公历：calendar.lunar2solar(1987,09,10); //[you can ignore params of prefix 0]
 */
const calendar = {

  /**
   * 农历1900-2100的润大小信息表
   * @Array Of Property
   * @return Hex
   */
  lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x16a95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
    /**Add By JJonline@JJonline.Cn**/
    0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
    0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
    0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
    0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
    0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
    0x0d520
  ], //2100

  /**
   * 公历每个月份的天数普通表
   * @Array Of Property
   * @return Number
   */
  solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

  /**
   * 天干地支之天干速查表
   * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
   * @return Cn string
   */
  Gan: ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"],

  /**
   * 天干地支之地支速查表
   * @Array Of Property
   * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
   * @return Cn string
   */
  Zhi: ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"],

  /**
   * 天干地支之地支速查表<=>生肖
   * @Array Of Property
   * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
   * @return Cn string
   */
  Animals: ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"],

  /**
   * 阳历节日
   */
  festival: {
    '1-1': {
      title: '元旦节'
    },
    '2-14': {
      title: '情人节'
    },
    '5-1': {
      title: '劳动节'
    },
    '5-4': {
      title: '青年节'
    },
    '6-1': {
      title: '儿童节'
    },
    '9-10': {
      title: '教师节'
    },
    '10-1': {
      title: '国庆节'
    },
    '12-25': {
      title: '圣诞节'
    },

    '3-8': {
      title: '妇女节'
    },
    '3-12': {
      title: '植树节'
    },
    '4-1': {
      title: '愚人节'
    },
    '5-12': {
      title: '护士节'
    },
    '7-1': {
      title: '建党节'
    },
    '8-1': {
      title: '建军节'
    },
    '12-24': {
      title: '平安夜'
    },
  },

  /**
   * 农历节日
   */
  lFestival: {
    '12-30': {
      title: '除夕'
    },
    '1-1': {
      title: '春节'
    },
    '1-15': {
      title: '元宵节'
    },
    '2-2': {
      title: '龙抬头'
    },
    '5-5': {
      title: '端午节'
    },
    '7-7': {
      title: '七夕节'
    },
    '7-15': {
      title: '中元节'
    },
    '8-15': {
      title: '中秋节'
    },
    '9-9': {
      title: '重阳节'
    },
    '10-1': {
      title: '寒衣节'
    },
    '10-15': {
      title: '下元节'
    },
    '12-8': {
      title: '腊八节'
    },
    '12-23': {
      title: '北方小年'
    },
    '12-24': {
      title: '南方小年'
    },
  },

  /**
   * 返回默认定义的阳历节日
   */
  getFestival() {
    return this.festival
  },

  /**
   * 返回默认定义的内容里节日
   */
  getLunarFestival() {
    return this.lFestival
  },

  /**
   *
   * @param param {Object} 按照festival的格式输入数据，设置阳历节日
   */
  setFestival(param = {}) {
    this.festival = param
  },

  /**
   *
   * @param param {Object} 按照lFestival的格式输入数据，设置农历节日
   */
  setLunarFestival(param = {}) {
    this.lFestival = param
  },

  /**
   * 24节气速查表
   * @Array Of Property
   * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
   * @return Cn string
   */
  solarTerm: ["\u5c0f\u5bd2", "\u5927\u5bd2", "\u7acb\u6625", "\u96e8\u6c34", "\u60ca\u86f0", "\u6625\u5206", "\u6e05\u660e", "\u8c37\u96e8", "\u7acb\u590f", "\u5c0f\u6ee1", "\u8292\u79cd", "\u590f\u81f3", "\u5c0f\u6691", "\u5927\u6691", "\u7acb\u79cb", "\u5904\u6691", "\u767d\u9732", "\u79cb\u5206", "\u5bd2\u9732", "\u971c\u964d", "\u7acb\u51ac", "\u5c0f\u96ea", "\u5927\u96ea", "\u51ac\u81f3"],

  /**
   * 1900-2100各年的24节气日期速查表
   * @Array Of Property
   * @return 0x string For splice
   */
  sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
    '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
    '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
    '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
    'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
    '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
    '97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
    '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
    '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
    '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
    '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
    '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
    '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
    '97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
    '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
    '9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
    '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
    '97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
    '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
    '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
    '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
    '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
    '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
    '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
    '97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
    '97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
    '9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
    '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
    '97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
    '9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
    '7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
    '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
    '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
    '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
    '97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
    '9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
    '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
    '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
    '977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
    '7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
    '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
    '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
    '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
    '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
    '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
    '977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
    '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
    '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
    '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
    '7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
    '7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
    '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
    '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
    '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
    '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
    '7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
    '7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
    '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
    '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
    '7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
    '665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
    '7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
    '7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
    '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'
  ],

  /**
   * 数字转中文速查表
   * @Array Of Property
   * @trans ['日','一','二','三','四','五','六','七','八','九','十']
   * @return Cn string
   */
  nStr1: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"],

  /**
   * 日期转农历称呼速查表
   * @Array Of Property
   * @trans ['初','十','廿','卅']
   * @return Cn string
   */
  nStr2: ["\u521d", "\u5341", "\u5eff", "\u5345"],

  /**
   * 月份转农历称呼速查表
   * @Array Of Property
   * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
   * @return Cn string
   */
  nStr3: ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"],

  /**
   * 返回农历y年一整年的总天数
   * @param y lunar Year
   * @return Number
   * @eg:var count = calendar.lYearDays(1987) ;//count=387
   */
  lYearDays: function (y) {
    let i, sum = 348;
    for (i = 0x8000; i > 0x8; i >>= 1) {
      sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
    }
    return (sum + this.leapDays(y));
  },

  /**
   * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
   * @param y lunar Year
   * @return Number (0-12)
   * @eg:var leapMonth = calendar.leapMonth(1987) ;//leapMonth=6
   */
  leapMonth: function (y) { //闰字编码 \u95f0
    return (this.lunarInfo[y - 1900] & 0xf);
  },

  /**
   * 返回农历y年闰月的天数 若该年没有闰月则返回0
   * @param y lunar Year
   * @return Number (0、29、30)
   * @eg:var leapMonthDay = calendar.leapDays(1987) ;//leapMonthDay=29
   */
  leapDays: function (y) {
    if (this.leapMonth(y)) {
      return ((this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
    }
    return (0);
  },

  /**
   * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
   * @param y lunar Year
   * @param m lunar Month
   * @return Number (-1、29、30)
   * @eg:var MonthDay = calendar.monthDays(1987,9) ;//MonthDay=29
   */
  monthDays: function (y, m) {
    if (m > 12 || m < 1) {
      return -1
    } //月份参数从1至12，参数错误返回-1
    return ((this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
  },

  /**
   * 返回公历(!)y年m月的天数
   * @param y solar Year
   * @param m solar Month
   * @return Number (-1、28、29、30、31)
   * @eg:var solarMonthDay = calendar.leapDays(1987) ;//solarMonthDay=30
   */
  solarDays: function (y, m) {
    if (m > 12 || m < 1) {
      return -1
    } //若参数错误 返回-1
    const ms = m - 1;
    if (ms === 1) { //2月份的闰平规律测算后确认返回28或29
      return (((y % 4 === 0) && (y % 100 !== 0) || (y % 400 === 0)) ? 29 : 28);
    } else {
      return (this.solarMonth[ms]);
    }
  },

  /**
   * 农历年份转换为干支纪年
   * @param  lYear 农历年的年份数
   * @return Cn string
   */
  toGanZhiYear: function (lYear) {
    var ganKey = (lYear - 3) % 10;
    var zhiKey = (lYear - 3) % 12;
    if (ganKey === 0) ganKey = 10; //如果余数为0则为最后一个天干
    if (zhiKey === 0) zhiKey = 12; //如果余数为0则为最后一个地支
    return this.Gan[ganKey - 1] + this.Zhi[zhiKey - 1];

  },

  /**
   * 公历月、日判断所属星座
   * @param  cMonth [description]
   * @param  cDay [description]
   * @return Cn string
   */
  toAstro: function (cMonth, cDay) {
    const s = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
    const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
    return s.substr(cMonth * 2 - (cDay < arr[cMonth - 1] ? 2 : 0), 2) + "\u5ea7"; //座
  },

  /**
   * 传入offset偏移量返回干支
   * @param offset 相对甲子的偏移量
   * @return Cn string
   */
  toGanZhi: function (offset) {
    return this.Gan[offset % 10] + this.Zhi[offset % 12];
  },

  /**
   * 传入公历(!)y年获得该年第n个节气的公历日期
   * @param y y公历年(1900-2100)
   * @param n n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起
   * @return day Number
   * @eg:var _24 = calendar.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
   */
  getTerm: function (y, n) {
    if (y < 1900 || y > 2100 || n < 1 || n > 24) {
      return -1;
    }
    const _table = this.sTermInfo[y - 1900];
    const _calcDay = []
    for (let index = 0; index < _table.length; index += 5) {
      const chunk = parseInt('0x' + _table.substr(index, 5)).toString()
      _calcDay.push(
        chunk[0],
        chunk.substr(1, 2),
        chunk[3],
        chunk.substr(4, 2)
      )
    }
    return parseInt(_calcDay[n - 1]);
  },

  /**
   * 传入农历数字月份返回汉语通俗表示法
   * @param m lunar month
   * @return Cn string
   * @eg:var cnMonth = calendar.toChinaMonth(12) ;//cnMonth='腊月'
   */
  toChinaMonth: function (m) { // 月 => \u6708
    if (m > 12 || m < 1) {
      return -1
    } //若参数错误 返回-1
    let s = this.nStr3[m - 1];
    s += "\u6708"; //加上月字
    return s;
  },

  /**
   * 传入农历日期数字返回汉字表示法
   * @param d lunar day
   * @return Cn string
   * @eg:var cnDay = calendar.toChinaDay(21) ;//cnMonth='廿一'
   */
  toChinaDay: function (d) { //日 => \u65e5
    let s;
    switch (d) {
      case 10:
        s = '\u521d\u5341';
        break;
      case 20:
        s = '\u4e8c\u5341';
        break;
      case 30:
        s = '\u4e09\u5341';
        break;
      default:
        s = this.nStr2[Math.floor(d / 10)];
        s += this.nStr1[d % 10];
    }
    return (s);
  },

  /**
   * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
   * @param y year
   * @return Cn string
   * @eg:var animal = calendar.getAnimal(1987) ;//animal='兔'
   */
  getAnimal: function (y) {
    return this.Animals[(y - 4) % 12]
  },

  /**
   * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
   * !important! 公历参数区间1900.1.31~2100.12.31
   * @param yPara  solar year
   * @param mPara  solar month
   * @param dPara  solar day
   * @return JSON object
   * @eg:console.log(calendar.solar2lunar(1987,11,01));
   */
  solar2lunar: function (yPara, mPara, dPara) {
    let y = parseInt(yPara);
    let m = parseInt(mPara);
    let d = parseInt(dPara);
    //年份限定、上限
    if (y < 1900 || y > 2100) {
      return -1; // undefined转换为数字变为NaN
    }
    //公历传参最下限
    if (y === 1900 && m === 1 && d < 31) {
      return -1;
    }

    //未传参  获得当天
    let objDate;
    if (!y) {
      objDate = new Date();
    } else {
      objDate = new Date(y, parseInt(m) - 1, d);
    }
    let i, leap = 0,
      temp = 0;
    //修正ymd参数
    y = objDate.getFullYear();
    m = objDate.getMonth() + 1;
    d = objDate.getDate();
    let offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      temp = this.lYearDays(i);
      offset -= temp;
    }
    if (offset < 0) {
      offset += temp;
      i--;
    }

    //是否今天
    let isTodayObj = new Date(),
      isToday = false;
    if (isTodayObj.getFullYear() === y && isTodayObj.getMonth() + 1 === m && isTodayObj.getDate() === d) {
      isToday = true;
    }
    //星期几
    let nWeek = objDate.getDay(),
      cWeek = this.nStr1[nWeek];
    //数字表示周几顺应天朝周一开始的惯例
    if (nWeek === 0) {
      nWeek = 7;
    }
    //农历年
    const year = i;
    leap = this.leapMonth(i); //闰哪个月
    let isLeap = false;

    //效验闰月
    for (i = 1; i < 13 && offset > 0; i++) {
      //闰月
      if (leap > 0 && i === (leap + 1) && isLeap === false) {
        --i;
        isLeap = true;
        temp = this.leapDays(year); //计算农历闰月天数
      } else {
        temp = this.monthDays(year, i); //计算农历普通月天数
      }
      //解除闰月
      if (isLeap === true && i === (leap + 1)) {
        isLeap = false;
      }
      offset -= temp;
    }
    // 闰月导致数组下标重叠取反
    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
      }
    }
    if (offset < 0) {
      offset += temp;
      --i;
    }
    //农历月
    const month = i;
    //农历日
    const day = offset + 1;
    //天干地支处理
    const sm = m - 1;
    const gzY = this.toGanZhiYear(year);

    // 当月的两个节气
    // bugfix-2017-7-24 11:03:38 use lunar Year Param `y` Not `year`
    const firstNode = this.getTerm(y, (m * 2 - 1)); //返回当月「节」为几日开始
    const secondNode = this.getTerm(y, (m * 2)); //返回当月「节」为几日开始

    // 依据12节气修正干支月
    let gzM = this.toGanZhi((y - 1900) * 12 + m + 11);
    if (d >= firstNode) {
      gzM = this.toGanZhi((y - 1900) * 12 + m + 12);
    }

    //传入的日期的节气与否
    let isTerm = false;
    let Term = null;
    if (firstNode === d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 2];
    }
    if (secondNode === d) {
      isTerm = true;
      Term = this.solarTerm[m * 2 - 1];
    }
    //日柱 当月一日与 1900/1/1 相差天数
    const dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
    const gzD = this.toGanZhi(dayCyclical + d - 1);
    //该日期所属的星座
    const astro = this.toAstro(m, d);

    const solarDate = y + '-' + m + '-' + d;
    const lunarDate = year + '-' + month + '-' + day;

    const festival = this.festival;
    const lFestival = this.lFestival;

    const festivalDate = m + '-' + d;
    let lunarFestivalDate = month + '-' + day;

    // bugfix https://github.com/jjonline/calendar.js/issues/29
    // 农历节日修正：农历12月小月则29号除夕，大月则30号除夕
    // 此处取巧修正：当前为农历12月29号时增加一次判断并且把lunarFestivalDate设置为12-30以正确取得除夕
    // 天朝农历节日遇闰月过前不过后的原则，此处取农历12月天数不考虑闰月
    // 农历润12月在本工具支持的200年区间内仅1574年出现
    if (month === 12 && day === 29 && this.monthDays(year, month) === 29) {
      lunarFestivalDate = '12-30';
    }
    return {
      date: solarDate,
      lunarDate: lunarDate,
      festival: festival[festivalDate] ? festival[festivalDate].title : null,
      lunarFestival: lFestival[lunarFestivalDate] ? lFestival[lunarFestivalDate].title : null,
      'lYear': year,
      'lMonth': month,
      'lDay': day,
      'Animal': this.getAnimal(year),
      'IMonthCn': (isLeap ? "\u95f0" : '') + this.toChinaMonth(month),
      'IDayCn': this.toChinaDay(day),
      'cYear': y,
      'cMonth': m,
      'cDay': d,
      'gzYear': gzY,
      'gzMonth': gzM,
      'gzDay': gzD,
      'isToday': isToday,
      'isLeap': isLeap,
      'nWeek': nWeek,
      'ncWeek': "\u661f\u671f" + cWeek,
      'isTerm': isTerm,
      'Term': Term,
      'astro': astro
    };
  },

  /**
   * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
   * !important! 参数区间1900.1.31~2100.12.1
   * @param y  lunar year
   * @param m  lunar month
   * @param d  lunar day
   * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
   * @return JSON object
   * @eg:console.log(calendar.lunar2solar(1987,9,10));
   */
  lunar2solar: function (y, m, d, isLeapMonth) {
    y = parseInt(y)
    m = parseInt(m)
    d = parseInt(d)
    isLeapMonth = !!isLeapMonth;
    const leapOffset = 0;
    const leapMonth = this.leapMonth(y);
    const leapDay = this.leapDays(y);
    if (isLeapMonth && (leapMonth !== m)) {
      return -1;
    } //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
    if (y === 2100 && m === 12 && d > 1 || y === 1900 && m === 1 && d < 31) {
      return -1;
    } //超出了最大极限值
    const day = this.monthDays(y, m);
    let _day = day;
    //bugFix 2016-9-25
    //if month is leap, _day use leapDays method
    if (isLeapMonth) {
      _day = this.leapDays(y, m);
    }
    if (y < 1900 || y > 2100 || d > _day) {
      return -1;
    } //参数合法性效验

    //计算农历的时间差
    let offset = 0;
    let i;
    for (i = 1900; i < y; i++) {
      offset += this.lYearDays(i);
    }
    let leap = 0,
      isAdd = false;
    for (i = 1; i < m; i++) {
      leap = this.leapMonth(y);
      if (!isAdd) { //处理闰月
        if (leap <= i && leap > 0) {
          offset += this.leapDays(y);
          isAdd = true;
        }
      }
      offset += this.monthDays(y, i);
    }
    //转换闰月农历 需补充该年闰月的前一个月的时差
    if (isLeapMonth) {
      offset += day;
    }
    //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
    const strap = Date.UTC(1900, 1, 30, 0, 0, 0);
    const calObj = new Date((offset + d - 31) * 86400000 + strap);
    const cY = calObj.getUTCFullYear();
    const cM = calObj.getUTCMonth() + 1;
    const cD = calObj.getUTCDate();

    return this.solar2lunar(cY, cM, cD);
  }
};


/*
 * Swipe 2.0
 *
 * Brad Birdsall
 * Copyright 2013, MIT License
 *
*/

function Swipe(container, options) {

  "use strict";

  // utilities
  var noop = function() {}; // simple no operation function
  var offloadFn = function(fn) { setTimeout(fn || noop, 0) }; // offload a functions execution

  // check browser capabilities
  var browser = {
    addEventListener: !!window.addEventListener,
    touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
    transitions: (function(temp) {
      var props = ['transitionProperty', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
      for ( var i in props ) if (temp.style[ props[i] ] !== undefined) return true;
      return false;
    })(document.createElement('swipe'))
  };

  // quit if no root element
  if (!container) return;
  var element = container.children[0];
  var slides, slidePos, width, length;
  options = options || {};
  var index = parseInt(options.startSlide, 10) || 0;
  var speed = options.speed || 300;
  options.continuous = options.continuous !== undefined ? options.continuous : true;

  function setup() {

    // cache slides
    slides = element.children;
    length = slides.length;

    // set continuous to false if only one slide
    if (slides.length < 2) options.continuous = false;

    //special case if two slides
    if (browser.transitions && options.continuous && slides.length < 3) {
      element.appendChild(slides[0].cloneNode(true));
      element.appendChild(element.children[1].cloneNode(true));
      slides = element.children;
    }

    // create an array to store current positions of each slide
    slidePos = new Array(slides.length);

    // determine width of each slide
    width = container.getBoundingClientRect().width || container.offsetWidth;

    element.style.width = (slides.length * width) + 'px';

    // stack elements
    var pos = slides.length;
    while(pos--) {

      var slide = slides[pos];

      slide.style.width = width + 'px';
      slide.setAttribute('data-index', pos);

      if (browser.transitions) {
        slide.style.left = (pos * -width) + 'px';
        move(pos, index > pos ? -width : (index < pos ? width : 0), 0);
      }

    }

    // reposition elements before and after index
    if (options.continuous && browser.transitions) {
      move(circle(index-1), -width, 0);
      move(circle(index+1), width, 0);
    }

    if (!browser.transitions) element.style.left = (index * -width) + 'px';

    container.style.visibility = 'visible';

  }

  function prev() {

    if (options.continuous) slide(index-1);
    else if (index) slide(index-1);

  }

  function next() {

    if (options.continuous) slide(index+1);
    else if (index < slides.length - 1) slide(index+1);

  }

  function circle(index) {

    // a simple positive modulo using slides.length
    return (slides.length + (index % slides.length)) % slides.length;

  }

  function slide(to, slideSpeed) {

    // do nothing if already on requested slide
    if (index == to) return;

    if (browser.transitions) {

      var direction = Math.abs(index-to) / (index-to); // 1: backward, -1: forward

      // get the actual position of the slide
      if (options.continuous) {
        var natural_direction = direction;
        direction = -slidePos[circle(to)] / width;

        // if going forward but to < index, use to = slides.length + to
        // if going backward but to > index, use to = -slides.length + to
        if (direction !== natural_direction) to =  -direction * slides.length + to;

      }

      var diff = Math.abs(index-to) - 1;

      // move all the slides between index and to in the right direction
      while (diff--) move( circle((to > index ? to : index) - diff - 1), width * direction, 0);

      to = circle(to);

      move(index, width * direction, slideSpeed || speed);
      move(to, 0, slideSpeed || speed);

      if (options.continuous) move(circle(to - direction), -(width * direction), 0); // we need to get the next in place

    } else {

      to = circle(to);
      animate(index * -width, to * -width, slideSpeed || speed);
      //no fallback for a circular continuous if the browser does not accept transitions
    }

    index = to;
    offloadFn(options.callback && options.callback(index, slides[index]));
  }

  function move(index, dist, speed) {

    translate(index, dist, speed);
    slidePos[index] = dist;

  }

  function translate(index, dist, speed) {

    var slide = slides[index];
    var style = slide && slide.style;

    if (!style) return;

    style.webkitTransitionDuration =
    style.MozTransitionDuration =
    style.msTransitionDuration =
    style.OTransitionDuration =
    style.transitionDuration = speed + 'ms';

    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
    style.msTransform =
    style.MozTransform =
    style.OTransform = 'translateX(' + dist + 'px)';

  }

  function animate(from, to, speed) {

    // if not an animation, just reposition
    if (!speed) {

      element.style.left = to + 'px';
      return;

    }

    var start = +new Date;

    var timer = setInterval(function() {

      var timeElap = +new Date - start;

      if (timeElap > speed) {

        element.style.left = to + 'px';

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

        clearInterval(timer);
        return;

      }

      element.style.left = (( (to - from) * (Math.floor((timeElap / speed) * 100) / 100) ) + from) + 'px';

    }, 4);

  }

  // setup auto slideshow
  var delay = options.auto || 0;
  var interval;

  function begin() {

    interval = setTimeout(next, delay);

  }

  function stop() {

    delay = 0;
    clearTimeout(interval);

  }


  // setup initial vars
  var start = {};
  var delta = {};
  var isScrolling;

  // setup event capturing
  var events = {

    handleEvent: function(event) {

      switch (event.type) {
        case 'touchstart': this.start(event); break;
        case 'touchmove': this.move(event); break;
        case 'touchend': offloadFn(this.end(event)); break;
        case 'webkitTransitionEnd':
        case 'msTransitionEnd':
        case 'oTransitionEnd':
        case 'otransitionend':
        case 'transitionend': offloadFn(this.transitionEnd(event)); break;
        case 'resize': offloadFn(setup); break;
      }

      if (options.stopPropagation) event.stopPropagation();

    },
    start: function(event) {

      var touches = event.touches[0];

      // measure start values
      start = {

        // get initial touch coords
        x: touches.pageX,
        y: touches.pageY,

        // store time to determine touch duration
        time: +new Date

      };

      // used for testing first move event
      isScrolling = undefined;

      // reset delta and end measurements
      delta = {};

      // attach touchmove and touchend listeners
      element.addEventListener('touchmove', this, false);
      element.addEventListener('touchend', this, false);

    },
    move: function(event) {

      // ensure swiping with one touch and not pinching
      if ( event.touches.length > 1 || event.scale && event.scale !== 1) return

      if (options.disableScroll) event.preventDefault();

      var touches = event.touches[0];

      // measure change in x and y
      delta = {
        x: touches.pageX - start.x,
        y: touches.pageY - start.y
      }

      // determine if scrolling test has run - one time test
      if ( typeof isScrolling == 'undefined') {
        isScrolling = !!( isScrolling || Math.abs(delta.x) < Math.abs(delta.y) );
      }

      // if user is not trying to scroll vertically
      if (!isScrolling) {

        // prevent native scrolling
        event.preventDefault();

        // stop slideshow
        stop();

        // increase resistance if first or last slide
        if (options.continuous) { // we don't add resistance at the end

          translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);

        } else {

          delta.x =
            delta.x /
              ( (!index && delta.x > 0               // if first slide and sliding left
                || index == slides.length - 1        // or if last slide and sliding right
                && delta.x < 0                       // and if sliding at all
              ) ?
              ( Math.abs(delta.x) / width + 1 )      // determine resistance level
              : 1 );                                 // no resistance if false

          // translate 1:1
          translate(index-1, delta.x + slidePos[index-1], 0);
          translate(index, delta.x + slidePos[index], 0);
          translate(index+1, delta.x + slidePos[index+1], 0);
        }

      }

    },
    end: function(event) {

      // measure duration
      var duration = +new Date - start.time;

      // determine if slide attempt triggers next/prev slide
      var isValidSlide =
            Number(duration) < 250               // if slide duration is less than 250ms
            && Math.abs(delta.x) > 20            // and if slide amt is greater than 20px
            || Math.abs(delta.x) > width/2;      // or if slide amt is greater than half the width

      // determine if slide attempt is past start and end
      var isPastBounds =
            !index && delta.x > 0                            // if first slide and slide amt is greater than 0
            || index == slides.length - 1 && delta.x < 0;    // or if last slide and slide amt is less than 0

      if (options.continuous) isPastBounds = false;

      // determine direction of swipe (true:right, false:left)
      var direction = delta.x < 0;

      // if not scrolling vertically
      if (!isScrolling) {

        if (isValidSlide && !isPastBounds) {

          if (direction) {

            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index-1), -width, 0);
              move(circle(index+2), width, 0);

            } else {
              move(index-1, -width, 0);
            }

            move(index, slidePos[index]-width, speed);
            move(circle(index+1), slidePos[circle(index+1)]-width, speed);
            index = circle(index+1);

          } else {
            if (options.continuous) { // we need to get the next in this direction in place

              move(circle(index+1), width, 0);
              move(circle(index-2), -width, 0);

            } else {
              move(index+1, width, 0);
            }

            move(index, slidePos[index]+width, speed);
            move(circle(index-1), slidePos[circle(index-1)]+width, speed);
            index = circle(index-1);

          }

          options.callback && options.callback(index, slides[index]);

        } else {

          if (options.continuous) {

            move(circle(index-1), -width, speed);
            move(index, 0, speed);
            move(circle(index+1), width, speed);

          } else {

            move(index-1, -width, speed);
            move(index, 0, speed);
            move(index+1, width, speed);
          }

        }

      }

      // kill touchmove and touchend event listeners until touchstart called again
      element.removeEventListener('touchmove', events, false)
      element.removeEventListener('touchend', events, false)

    },
    transitionEnd: function(event) {

      if (parseInt(event.target.getAttribute('data-index'), 10) == index) {

        if (delay) begin();

        options.transitionEnd && options.transitionEnd.call(event, index, slides[index]);

      }

    }

  }

  // trigger setup
  setup();

  // start auto slideshow if applicable
  if (delay) begin();


  // add event listeners
  if (browser.addEventListener) {

    // set touchstart event on element
    if (browser.touch) element.addEventListener('touchstart', events, false);

    if (browser.transitions) {
      element.addEventListener('webkitTransitionEnd', events, false);
      element.addEventListener('msTransitionEnd', events, false);
      element.addEventListener('oTransitionEnd', events, false);
      element.addEventListener('otransitionend', events, false);
      element.addEventListener('transitionend', events, false);
    }

    // set resize event on window
    window.addEventListener('resize', events, false);

  } else {

    window.onresize = function () { setup() }; // to play nice with old IE

  }

  // expose the Swipe API
  return {
    setup: function() {

      setup();

    },
    slide: function(to, speed) {

      // cancel slideshow
      stop();

      slide(to, speed);

    },
    prev: function() {

      // cancel slideshow
      stop();

      prev();

    },
    next: function() {

      // cancel slideshow
      stop();

      next();

    },
    stop: function() {

      // cancel slideshow
      stop();

    },
    getPos: function() {

      // return current index position
      return index;

    },
    getNumSlides: function() {

      // return total number of slides
      return length;
    },
    kill: function() {

      // cancel slideshow
      stop();

      // reset element
      element.style.width = '';
      element.style.left = '';

      // reset slides
      var pos = slides.length;
      while(pos--) {

        var slide = slides[pos];
        slide.style.width = '';
        slide.style.left = '';

        if (browser.transitions) translate(pos, 0, 0);

      }

      // removed event listeners
      if (browser.addEventListener) {

        // remove current event listeners
        element.removeEventListener('touchstart', events, false);
        element.removeEventListener('webkitTransitionEnd', events, false);
        element.removeEventListener('msTransitionEnd', events, false);
        element.removeEventListener('oTransitionEnd', events, false);
        element.removeEventListener('otransitionend', events, false);
        element.removeEventListener('transitionend', events, false);
        window.removeEventListener('resize', events, false);

      }
      else {

        window.onresize = null;

      }

    }
  }

}


if ( window.jQuery || window.Zepto ) {
  (function($) {
    $.fn.Swipe = function(params) {
      return this.each(function() {
        $(this).data('Swipe', new Swipe($(this)[0], params));
      });
    }
  })( window.jQuery || window.Zepto )
}

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
