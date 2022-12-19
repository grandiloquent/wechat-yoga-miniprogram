class CustomInput extends HTMLElement {

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        this.root.innerHTML = `<style>
      
            
                  
                        
                              
                                    
                                          
                                                
                                                      
                                                            
                                                                  
                                                                        
                                                                              
                                                                                    
                                                                                          
                                                                                                
                                                                                                      
                                                                                                            
                                                                                                                  
                                                                                                                        
                                                                                                                              
                                                                                                                                    
                                                                                                                                          
                                                                                                                                                
                                                                                                                                                      
                                                                                                                                                            
                                                                                                                                                                  
                                                                                                                                                                        
                                                                                                                                                                              
                                                                                                                                                                                    
                                                                                                                                                                                          .input
                                                                                                                                                                                          {
                                                                                                                                                                                              font-size: 16px;
                                                                                                                                                                                              line-height: 56px;
                                                                                                                                                                                              padding: 0;
                                                                                                                                                                                              outline: none;
                                                                                                                                                                                              border: none;
                                                                                                                                                                                              flex-grow: 1;
                                                                                                                                                                                              resize:none;
                                                                                                                                                                                          }
                                                                                                                                                                                          .label
                                                                                                                                                                                          {
                                                                                                                                                                                              color: #5f6368;
                                                                                                                                                                                              position: absolute;
                                                                                                                                                                                              left: 12px;
                                                                                                                                                                                              top: 0;
                                                                                                                                                                                              font-size: 16px;
                                                                                                                                                                                              background: #fff;
                                                                                                                                                                                              line-height: 56px;
                                                                                                                                                                                              transition: transform 150ms cubic-bezier(.4,0,.2,1),color 150ms cubic-bezier(.4,0,.2,1);
                                                                                                                                                                                          }
                                                                                                                                                                                          .layout
                                                                                                                                                                                          {
                                                                                                                                                                                              display: flex;
                                                                                                                                                                                              align-items: center;
                                                                                                                                                                                              justify-content: center;
                                                                                                                                                                                              border-radius: 4px;
                                                                                                                                                                                              border: 1px solid #80868b;
                                                                                                                                                                                              padding: 0 12px;
                                                                                                                                                                                              margin: 14px 20px 28px;
                                                                                                                                                                                              position: relative;
                                                                                                                                                                                          }
                                                                                                                                                                                          input::-webkit-outer-spin-button,
                                                                                                                                                                                          input::-webkit-inner-spin-button {
                                                                                                                                                                                              /* display: none; <- Crashes Chrome on hover */
                                                                                                                                                                                              -webkit-appearance: none;
                                                                                                                                                                                              margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
                                                                                                                                                                                          }
                                                                                                                                                                                          
                                                                                                                                                                                          input[type=number] {
                                                                                                                                                                                              -moz-appearance:textfield; /* Firefox */
                                                                                                                                                                                          }
                                                                                                                                                                                          
                                                                                                                                                                                          
                                                                                                                                                                                        
                                                                                                                                                                                  
                                                                                                                                                                            
                                                                                                                                                                        
                                                                                                                                                                      
                                                                                                                                                                  
                                                                                                                                                                  
                                                                                                                                                                
                                                                                                                                                          
                                                                                                                                                    
                                                                                                                                              
                                                                                                                                        
                                                                                                                                  
                                                                                                                            
                                                                                                                        
                                                                                                                      
                                                                                                                  
                                                                                                                
                                                                                                          
                                                                                                    
                                                                                              
                                                                                        
                                                                                  
                                                                            
                                                                      
                                                                
                                                          
                                                    
                                              
                                        
                                  
                            
                      
                
          
    </style>
    <div class="layout">
      <input class="input" type="text" /><span class="label">
      </span>
    </div>`;
    }


    static get observedAttributes() {
        return ['label', 'type'];
    }


    connectedCallback() {

        this.root.host.style.userSelect = 'none';

        this.input = this.root.querySelector('.input');
        this.input.addEventListener('click', evt => {
            this.collapse();
        })
        this.input.addEventListener('input', evt => {
            if (this.input.value.length === 0)
                this.expand();
            else
                this.collapse();

        })
        this.input.addEventListener('keydown', evt => {
            if (this.input.dataset.type === 'phone') {
                if (((evt.keyCode < 49 || evt.keyCode > 57) && evt.keyCode !== 8)
                    || (this.input.value.length >= 11 && evt.keyCode !== 8)) {
                    evt.preventDefault();
                }
            }
        })
        this.label = this.root.querySelector('.label');
        this.label.addEventListener('click', evt => {
            this.collapse();
        });
        this.label.textContent = this.getAttribute('label');




        // this.dispatchEvent(new CustomEvent());
        /*
        this.dispatchEvent(new CustomEvent('submit', {
                  detail: 0
              }));
              */
    }
    collapse() {
        if (!this.label.hasAttribute('collapse')) {
            this.label.setAttribute('collapse', '');
            this.label.style.lineHeight = '16px';
            this.label.style.background = '#fff';
            this.label.style.transform = 'translateY(-9px) scale(.75)'
        }
    }
    expand() {
        if (this.label.hasAttribute('collapse')) {
            this.label.removeAttribute('collapse');
            this.label.style.background = 'transparent';
            this.label.style.lineHeight = '56px';
            this.label.style.transform = 'translateY(0px) scale(1)'
        }
    }
    get value() {
        return this.input.value;
    }
    set value(v) {
        this.collapse();
        this.input.value = v;
    }
    disconnectedCallback() {

    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'label') {
            this.root.querySelector('.label').textContent = newVal;
        } else if (attrName === 'type') {
            const input = this.root.querySelector('.input');
            if (newVal === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.className = 'input';
                textarea.style.minHeight = '150px';
                input.replaceWith(textarea)
            }
            else
                input.dataset.type = newVal;
        }
    }

}
customElements.define('custom-input', CustomInput);
/*
<!--\
<custom-input></custom-input>
<script src="custom-input.js"></script>
const customInput = document.querySelector('custom-input');
const customInput = document.createElement('custom-input');
customInput.setAttribute('label','');
document.body.appendChild(customInput);
-->
*/