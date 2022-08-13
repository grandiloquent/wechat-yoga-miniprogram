class CustomActions extends HTMLElement {
    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
        const style = document.createElement('style');
        this.root.appendChild(style);
        style.textContent = `.wrapper {
            user-select: none;
}
.item-container {
    position: relative;
    display: flex;
    height: 100%;
    max-width: 100%;
    overflow-y: hidden;
    overflow-x: overlay;
    padding-left: 16px;
}
.item-container::-webkit-scrollbar {
    display: none;
}
.item.active {
    border: 1px solid transparent;
    background: #e8f0fe;
    color: #1967d2;
}
.item {
    display: flex;
    align-items: center;
    cursor: pointer;
    white-space: nowrap;
    outline: none;
    font-size: .875rem;
    font-weight: 500;
    line-height: 1.25rem;
    border-radius: 24px;
    box-sizing: border-box;
    border: 1px solid #dadce0;
    color: #3c4043;
    padding: 5px 13px;
    margin-right: 8px;
}`;
        const wrapper = document.createElement('div');
        wrapper.setAttribute("class", "wrapper");
        this.root.appendChild(wrapper);
        const itemContainer = document.createElement('div');
        itemContainer.setAttribute("class", "item-container");
        wrapper.appendChild(itemContainer);
        this.itemContainer = itemContainer;
    }
    static get observedAttributes() {
        return ['items'];
    }
    connectedCallback() {
        // 
    }
    disconnectedCallback() {
    }
    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName === 'items') {
            const items = [];
            JSON.parse(newVal).forEach((x, k) => {
                const itemActive = document.createElement('div');
                if (k === 0)
                    itemActive.setAttribute("class", "item active");
                else
                    itemActive.setAttribute("class", "item");
                itemActive.textContent = x;
                this.itemContainer.appendChild(itemActive);
                items.push(itemActive);
            });
            items.forEach((x, k) => {
                x.addEventListener('click', evt => {
                    items.forEach(x => {
                        if (x === evt.currentTarget) {
                            x.classList.add('active');
                        }
                        else {
                            x.classList.remove('active');
                        }
                    });
                    this.dispatchEvent(new CustomEvent('touch', {
                        detail: k
                    }));
                })
            })
        }
    }
}
customElements.define('custom-actions', CustomActions);
/*
<!--
<script src="actions.js"></script>
<custom-actions></custom-actions>
const customCustomActions = document.querySelector('custom-actions');
-->
*/