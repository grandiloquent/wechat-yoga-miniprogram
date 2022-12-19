class CustomBottomGrid extends HTMLElement {

    constructor() {
        super();
				
        this.root = this.attachShadow({mode: 'open'});

this.root.innerHTML=`
		<style>
        </style>
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
customElements.define('custom-bottom-grid', CustomBottomGrid);
/*
<!--\
<custom-bottom-grid></custom-bottom-grid>
<script src="components/bottom-grid.js"></script>
const customBottomGrid = document.querySelector('custom-bottom-grid');
const customBottomGrid = document.createElement('custom-bottom-grid');
customBottomGrid.setAttribute('data',JSON.stringify(obj));
document.body.appendChild(customBottomGrid);
-->
*/