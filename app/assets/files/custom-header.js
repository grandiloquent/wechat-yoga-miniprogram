class CustomHeader extends HTMLElement {

    constructor() {
        super();
				
        this.root = this.attachShadow({mode: 'open'});

this.root.innerHTML=`
<div style="height: 48px; display: flex; -webkit-box-align: center; align-items: center; position: relative; z-index: 3; box-shadow: 0 4px 2px -2px rgba(0,0,0,.2);">
  <div style="word-wrap: break-word; -webkit-text-size-adjust: 100%; padding: 0; border: none; outline: none; font: inherit; text-transform: inherit; color: inherit; background: transparent; cursor: pointer; display: flex; -webkit-box-align: center; align-items: center; height: 48px; text-align: left;">
    <div style="word-wrap: break-word; -webkit-text-size-adjust: 100%; font: inherit; text-transform: inherit; cursor: pointer; text-align: left; flex-shrink: 0; fill: currentColor; stroke: none; display: block; padding: 0 12px; width: 89px; height: 20px; color: #212121; margin-left: 0;">
    </div>
  </div>
  <div style="display: flex; -webkit-box-align: center; align-items: center; -webkit-box-flex: 1; flex-grow: 1; -webkit-box-pack: end; justify-content: flex-end; color: #606060; min-width: 0;">
    <div style="word-wrap: break-word; -webkit-text-size-adjust: 100%; outline: none; font: inherit; text-transform: inherit; color: inherit; cursor: pointer; border: none; background: transparent; box-sizing: border-box; padding: 12px; height: 48px; width: 48px;">
      <div style="word-wrap: break-word; -webkit-text-size-adjust: 100%; font: inherit; text-transform: inherit; color: inherit; cursor: pointer; flex-shrink: 0; width: 24px; height: 24px; fill: currentColor; stroke: none; display: block;">
        <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24">
          <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z">
          </path>
        </svg>
      </div>
    </div>
  </div>
</div>
		`;
    }

 
    static get observedAttributes() {
        return ['data'];
    }
  

    connectedCallback() {
		
this.root.host.style.userSelect='none';
        
      // this.dispatchEvent(new CustomEvent());
	  /*
	  this.dispatchEvent(new CustomEvent('submit', {
                detail: 0
            }));
			*/
    }
    disconnectedCallback() {
       
    }
    
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'data') {
            const obj = JSON.parse(newVal);
        }
    }
   
}
customElements.define('custom-header', CustomHeader);
/*
<!--\
<custom-header></custom-header>
<script src="custom-header.js"></script>
const customHeader = document.querySelector('custom-header');
const customHeader = document.createElement('custom-header');
customHeader.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customHeader);
-->
*/