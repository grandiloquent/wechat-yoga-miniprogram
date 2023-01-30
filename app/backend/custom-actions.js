(() => {
    class CustomActions extends HTMLElement {

        constructor() {
            super();
            this.attachShadow({
                mode: 'open'
            });
            const wrapper = document.createElement("div");
            wrapper.setAttribute("class", "wrapper");
            const style = document.createElement('style');
            style.textContent = `.wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
}

.item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;
  outline: none;
  letter-spacing: .01785714em;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-size: .875rem;
  font-weight: 500;
  line-height: 1.25rem;
  border-radius: 24px;
  box-sizing: border-box;
  border: 1px solid #dadce0;
  color: #3c4043;
  padding: 5px 13px;
}

.selected {
  border: 1px solid transparent;
  background: #e8f0fe;
  color: #1967d2;
}`;
            this.wrapper = wrapper;
            this.shadowRoot.append(style, wrapper);
            this._items = [];
        }

        navigate(e) {
            this._items.forEach(element => element.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            this.dispatchEvent(new CustomEvent('submit', {
                detail: e.currentTarget.dataset.id
            }));
        }
        set data(value) {
            value.map((element, index) => {
                const item = document.createElement('div');
                if (index === 0) {
                    item.setAttribute("class", "item selected");
                } else {
                    item.setAttribute("class", "item");
                }
                item.dataset.id = element.id;
                item.addEventListener('click', this.navigate.bind(this));
                item.textContent = element.title;
                this._items.push(item);
                this.wrapper.appendChild(item);
            })

        }

        connectedCallback() {
        }
    }
    customElements.define('custom-actions', CustomActions);
    /*
    <!--
    <script type="module" src="./components/custom-actions.js"></script>
  <custom-actions></custom-actions>
  customElements.whenDefined('custom-actions').then(() => {
  customActions.data = []
  })
  -->
  */
})();