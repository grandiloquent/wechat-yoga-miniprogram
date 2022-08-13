class CustomCell extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

    }


    static get observedAttributes() {
        return ["key", "value"];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
        .cell
        {
            position: relative;
            display: flex;
            box-sizing: border-box;
            width: 100%;
            padding: 10px 16px;
            overflow: hidden;
            color: #323233;
            font-size: 14px;
            line-height: 24px;
            background: #fff;
            cursor: pointer;
            border-bottom:1px solid rgb(235, 237, 240);
        }
        .cell__right-icon
        {
            height: 24px;
            width: 16px;
            color: #969799;
            fill:currentColor;
            margin-left:4px;
        }
        .cell__value
        {
            flex: 1;
            position: relative;
            overflow: hidden;
            color: #969799;
            text-align: right;
            vertical-align: middle;
            word-wrap: break-word;
        }
        .cell__title
        {
            cursor: pointer;
            flex: 1;
        }
      svg{
        height:100%;
        width:100%;
      }
      </style>
      <div class="cell">
        <div class="cell__title">
          单元格
        </div>
        <div class="cell__value">
          单元格
        </div>
        <div class="cell__right-icon">
          <svg viewBox="0 0 24 24">
            <path d="M5.859 4.125l2.156-2.109 9.984 9.984-9.984 9.984-2.156-2.109 7.922-7.875z">
            </path>
          </svg>
        </div>
      </div>
        `;
        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('touch', {
                  detail: 0
              }));
              */
        this.cellTitle = this.root.querySelector('.cell__title');
        if (this.cellTitleString) {
            this.cellTitle.textContent = this.cellTitleString;
        }
        this.cellValue = this.root.querySelector('.cell__value');
        if (this.cellValueString) {
            this.cellValue.textContent = this.cellValueString;
        }
    }
    get value() {
        return this.cellValueString;
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'key') {
            this.cellTitleString = newVal;
            if (this.cellTitle)
                this.cellTitle.textContent = newVal;
        } else if (attrName === 'value') {
            this.cellValueString = newVal;
            if (this.cellValue)
                this.cellValue.textContent = newVal;
            
               
        }
    }

}
customElements.define('custom-cell', CustomCell);
/*
<!--\
<custom-cell></custom-cell>
<script src="components/cell.js"></script>
const customCell = document.querySelector('custom-cell');
const customCell = document.createElement('custom-cell');
customCell.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customCell);
-->
*/