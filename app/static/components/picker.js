class CustomPicker extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.innerHTML = `
<style>
.{

}.picker__frame
{
    position: absolute;
    top: 50%;
    right:0;
    left: 0;
    z-index: 2;
    transform: translateY(-50%);
    pointer-events: none;
    border:1px  solid #ebedf0;
    border-left:0;
    border-right:0
}
.picker__mask
{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(180deg,hsla(0,0%,100%,.9),hsla(0,0%,100%,.4)),linear-gradient(0deg,hsla(0,0%,100%,.9),hsla(0,0%,100%,.4));
    background-repeat: no-repeat;
    background-position: top,bottom;
    transform: translateZ(0);
    pointer-events: none;
    background-size: 100% 62px;
}
.picker-column__item
{
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding: 0 4px;
    color: #000;
}
.picker-column__wrapper
{
    transition-timing-function: cubic-bezier(.23,1,.68,1);
    transition-duration: 200ms;
    transition-property: none;
    transform :translate3d(0px, 48px, 0px);
    transform-origin: 0 0;
}
.picker-column
{
    -webkit-box-flex: 1;
    flex: 1;
    overflow: hidden;
    font-size: 16px;
}
.picker__columns
{
    position: relative;
    display: flex;
    cursor: grab;
     
}</style>
    <div class="picker__columns">
      <div class="picker-column">
        <div class="picker-column__wrapper">
          
        </div>
        <div class="picker__mask">
        </div>
        <div class="picker__frame">
        </div>
      </div>
    </div>
		`;
    }


    static get observedAttributes() {
        return ['mode', 'start', 'month'];
    }
    get mode() {
        return this.getAttribute('mode')
    }
    get start() {
        return this.getAttribute('start')
    }
    get month() {
        return this.getAttribute('month')
    }
    connectedCallback() {
        this.offset = 0;
        if (this.mode === '1') {
            this.count = 10;
        } else if (this.mode === '2') {
            this.count = 12;
        } else if (this.mode === '3') {
            const month = parseInt(this.month);
            this.count = new Date(new Date().getFullYear(), month - 1, 0).getDate();
        }
        this.min = -1;
        this.max = this.min + this.count - 1;
        this.root.host.style.userSelect = 'none';
        this.pickerColumnWrapper = this.root.querySelector('.picker-column__wrapper');
        this.pickerColumns = this.root.querySelector('.picker__columns');
        this.pickerColumns.addEventListener('touchstart', event => {
            event.stopPropagation();
            this.startY = event.touches[0].clientY;
            this.startOffset = this.offset;
            // duration: 0,
        });
        this.pickerColumns.addEventListener('touchmove', event => {
            event.stopPropagation();
            const deltaY = event.touches[0].clientY - this.startY;
            this.offset = range(
                this.startOffset + deltaY,
                -(this.count * this.itemHeight),
                (this.count * this.itemHeight)
            );
            this.pickerColumnWrapper.style.transform = `translate3d(0px, ${this.offset}px, 0px)`
        });
        this.pickerColumns.addEventListener('touchend', event => {
            event.stopPropagation();
            const index = Math.round(-this.offset / this.itemHeight);
            this.setIndex(index, true);
        });
        const items = [];
        const y = new Date().getFullYear();
        for (let i = 0; i < this.count; i++) {
            const pickerColumnItem = document.createElement('div');
            pickerColumnItem.setAttribute("class", "picker-column__item");
            if (this.mode === '1')
                pickerColumnItem.textContent = `${y + i}年`;
            else if (this.mode === '2')
                pickerColumnItem.textContent = `${i + 1}月`;
            else if (this.mode === '3')
                pickerColumnItem.textContent = `${i + 1}日`;
            pickerColumnItem.style.height = '48px';
            pickerColumnItem.style.color = '#000'
            this.pickerColumnWrapper.appendChild(pickerColumnItem);
            items.push(pickerColumnItem);
        }
        this.pickerFrame = this.root.querySelector('.picker__frame');
        this.pickerFrame.addEventListener('click', evt => {

        })
        this.itemHeight = items[0].getBoundingClientRect().height;

        this.pickerColumns.style.height = `${this.itemHeight * 3}px`; //(this.itemHeight * (this.count +(this.count % 2 === 0 ? 1 : 0))) + 'px';

        this.pickerFrame.style.height = `${this.itemHeight}px`;
        if (this.mode === '1') {
            if (this.start) {
                this.setIndex(parseInt(this.start)-((new Date()).getFullYear()) - 1);
            } else {
                this.setIndex(- 1);
            }
        }
        else if (this.mode === '2') {
            if (this.start) {
                this.setIndex(parseInt(this.start) - 2);
            } else {
                this.setIndex(new Date().getMonth() - 1);
            }
        }
        else if (this.mode === '3') {
            if (this.start) {
                this.setIndex(parseInt(this.start) - 2);
            } else {
                this.setIndex(new Date().getDate() - 2)
            }

        }

        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
    }
    get value() {

        if (this.mode === '1')
            return new Date().getFullYear() + this.currentIndex + 1;
        else if (this.mode === '2')
            return this.currentIndex + 2;
        else if (this.mode === '3')
            return this.currentIndex + 2;
    }
    adjustIndex(index) {
        const count = this.count;

        index = range(index, this.min, this.max);
        // for (let i = index; i < count; i++) {
        //     return i;
        // }
        // for (let i = index - 1; i >= 0; i--) {
        //     return i;
        // }
        return index;
    }
    setIndex(index) {
        // const { data } = this;
        index = this.adjustIndex(index) || 0;

        this.offset = -index * this.itemHeight;
        if (index !== this.currentIndex) {
            this.currentIndex = index;

        }

        this.pickerColumnWrapper.style.transform = `translate3d(0px, ${this.offset}px, 0px)`
    }
    disconnectedCallback() {

    }
    getCount() {
        return 5;
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'start') {
            if (this.mode === '1') {
                this.setIndex(parseInt(newVal)-((new Date()).getFullYear()) - 1);
            }
            else if (this.mode === '2') {
                this.setIndex(parseInt(newVal) - 2);
            }
            else if (this.mode === '3') {
                this.setIndex(parseInt(newVal) - 2);
            }
        }
    }

}
customElements.define('custom-picker', CustomPicker);
/*
<!--\
<custom-picker></custom-picker>
<script src="components/picker.js"></script>
const customPicker = document.querySelector('custom-picker');
const customPicker = document.createElement('custom-picker');
customPicker.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customPicker);
-->
*/