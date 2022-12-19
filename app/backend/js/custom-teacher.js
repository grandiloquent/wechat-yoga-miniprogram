class CustomTeacher extends HTMLElement {

    constructor() {
        super();
				
        this.root = this.attachShadow({mode: 'open'});

this.root.innerHTML=`
		<style>
        </style>
		`;
    }

 
    static get observedAttributes() {
        return ['title'];
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
        if (attrName === 'title') {
            this.root.querySelector('.title').textContent = newVal;
        }
    }
   
}
customElements.define('custom-teacher', CustomTeacher);
/*
<!--\
<custom-teacher></custom-teacher>
<script src="custom-teacher.js"></script>
const customTeacher = document.querySelector('custom-teacher');
const customTeacher = document.createElement('custom-teacher');
customTeacher.setAttribute('title','');
document.body.appendChild(customTeacher);
-->
*/