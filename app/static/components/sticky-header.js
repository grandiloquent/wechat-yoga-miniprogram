class CustomStickyHeader extends HTMLElement {

    constructor() {
        super();

        this.root = this.attachShadow({ mode: 'open' });

        this.root.host.style.userSelect = 'none';
        this.root.innerHTML = `
        <style>
      
      
        .out
        {
            top: -48px!important;
            -webkit-transition: -webkit-transform 195ms cubic-bezier(.4,0,1,1);
            transition: -webkit-transform 195ms cubic-bezier(.4,0,1,1);
            transition: transform 195ms cubic-bezier(.4,0,1,1);
            transition: transform 195ms cubic-bezier(.4,0,1,1),-webkit-transform 195ms cubic-bezier(.4,0,1,1);
            -webkit-transition-property: all;
            transition-property: all;
            box-shadow:none!important;
        }
        .in
        {
            top:0px!important;
            -webkit-transition: -webkit-transform 225ms cubic-bezier(0,0,.2,1);
            transition: -webkit-transform 225ms cubic-bezier(0,0,.2,1);
            transition: transform 225ms cubic-bezier(0,0,.2,1);
            transition: transform 225ms cubic-bezier(0,0,.2,1),-webkit-transform 225ms cubic-bezier(0,0,.2,1);
            -webkit-transition-property: all;
            transition-property: all;
        }

</style>
<div style="font-size:16px;color:rgb(3,3,3);line-height:20px;height: 48px; position: fixed; top: 0; left: 0; right: 0; padding: 0; padding: 0 env(safe-area-inset-right) 0 env(safe-area-inset-left); display: flex; align-items: center; justify-content: center; background: #fff; box-shadow: 0 4px 2px -2px rgba(0,0,0,.2);z-index:1">
<div id="back" style="margin-right:24px;display: inline-block; flex-shrink: 0; width: 48px; height: 48px; fill: #606060; stroke: none; padding: 12px; box-sizing: border-box;">
  <svg style="width: 24px; height: 24px;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <path d="M532.526499 904.817574L139.506311 511.797385 532.526499 118.777197c12.258185-12.258185 12.432147-32.892131-0.187265-45.51052-12.707416-12.707416-32.995485-12.703323-45.511543-0.187265L75.166957 484.739123c-7.120165 7.120165-10.163477 17.065677-8.990768 26.624381-1.500167 9.755178 1.5104 20.010753 8.990768 27.491121l411.660734 411.660734c12.258185 12.258185 32.892131 12.432147 45.511543-0.187265 12.707416-12.707416 12.7023-32.995485 0.187265-45.51052z">
    </path>
  </svg>
</div>
<div id="title" style="flex-grow: 1;">
</div>
</div>
        `;
        this.container = this.root.querySelector('div');

    }


    static get observedAttributes() {
        return ['active', 'inactive', 'title'];
    }


    connectedCallback() {
        this.root.querySelector('#back').addEventListener('click', evt => {
            window.history.back();
        })
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
        if (attrName === 'active') {
            this.container.className = 'in';
        } else if (attrName === 'inactive') {
            this.container.className = 'out';
        } else {
            this.root.querySelector('#title').textContent = newVal;
        }
    }

}
customElements.define('custom-sticky-header', CustomStickyHeader);
/*
<!--\
<custom-sticky-header></custom-sticky-header>
<script src="components/sticky-header.js"></script>
const customStickyHeader = document.querySelector('custom-sticky-header');
const customStickyHeader = document.createElement('custom-sticky-header');
customStickyHeader.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customStickyHeader);
-->
*/