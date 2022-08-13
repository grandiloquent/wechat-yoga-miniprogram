class CustomNotice extends HTMLElement {

    constructor() {
        super();
				
        this.root = this.attachShadow({mode: 'open'});
		
this.root.host.style.userSelect='none';
const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent=``

        this.root.appendChild(this.container);
    }

 
    static get observedAttributes() {
        return ['text'];
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
        if (attrName === 'show') {
            this.root.querySelector('.wrapper').style.transform = 'translateX(250px)';
        }
    }
   
}
customElements.define('custom-notice', CustomNotice);
/*
<!--\
<custom-notice></custom-notice>
<script src="components/notice.js"></script>
const customNotice = document.querySelector('custom-notice');
const customNotice = document.createElement('custom-notice');
customNotice.setAttribute('',JSON.stringify(obj));
-->
*/