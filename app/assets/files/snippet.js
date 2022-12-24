const snippets = JSON.parse(window.localStorage.getItem('snippets'))

const wrapper = document.querySelector('.wrapper');
const textarea = document.querySelector('textarea');

Object.keys(snippets).sort().forEach(value => {
    const div = document.createElement('div');
    const template = `<div class="field">
    <div class="field__label">
    更新
    </div>
    <div class="field__value">
        <div class="field__body">
            <input type="text" placeholder="" class="field__control" value='${value}' data-value='${value}'>
        </div>
    </div>
</div>`;
    div.insertAdjacentHTML('afterbegin', template)
    div.querySelector('.field__label').addEventListener('click', evt => {
        if (textarea.dataset.key) {
            snippets[textarea.dataset.key] = textarea.value;
        }
        const input = div.querySelector('.field__control');
        if (input.dataset.value !== input.value) {
            snippets[input.value] = snippets[input.dataset.value];
            delete snippets[input.dataset.value];
            input.dataset.value = input.value
            evt.stopPropagation();
            textarea.dataset.key = input.value;
            textarea.value = snippets[value];
        } else {
            evt.stopPropagation();
            textarea.dataset.key = value;
            textarea.value = snippets[value];
        }

    });

    wrapper.appendChild(div);
});

document.addEventListener('visibilitychange', evt => {
    localStorage.setItem('snippets', JSON.stringify(snippets))
})

document.querySelector('button').addEventListener('click', evt => {
    evt.stopPropagation();
    const div = document.createElement('div');

    let value = "new999";
    // if (typeof NativeAndroid !== 'undefined') {
    //     value = NativeAndroid.readText()
    // } else {
    //     value = await navigator.clipboard.readText()
    // }
    const template = `<div class="field">
    <div class="field__label">
    更新
    </div>
    <div class="field__value">
        <div class="field__body">
            <input type="text" placeholder="" class="field__control" value='${value}'>
        </div>
    </div>
</div>`;
    snippets[value] = '';
    div.insertAdjacentHTML('afterbegin', template)
    console.log(snippets);
    div.querySelector('.field__label').addEventListener('click', evt => {
        if (textarea.dataset.key) {
            snippets[textarea.dataset.key] = textarea.value;
        }
        const input = div.querySelector('.field__control');
        if (input.dataset.value !== input.value) {
            snippets[input.value] = snippets[input.dataset.value];
            delete snippets[input.dataset.value];
            input.dataset.value = input.value
            evt.stopPropagation();
            textarea.dataset.key = input.value;
            textarea.value = snippets[value];
        } else {
            evt.stopPropagation();
            textarea.dataset.key = value;
            textarea.value = snippets[value];
        }
    });

    wrapper.appendChild(div);
});

