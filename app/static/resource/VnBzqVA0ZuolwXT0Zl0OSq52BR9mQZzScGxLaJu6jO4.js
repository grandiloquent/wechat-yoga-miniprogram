let baseUri = "";
let left = document.getElementById('left');
let right = document.getElementById('right');

let limit = 20;
let offset = 0;
let leftHeight = 0;
let rightHeight = 0;
let halfWidth = window.innerWidth / 2;
console.log(window.innerWidth,document.body.clientWidth)
left.style.width = halfWidth + 'px'
right.style.width = halfWidth + 'px';
let first = true;
let loading = false;

async function fetchPictures() {
    let response = await fetch(`${baseUri}/api/picture?mode=1&limit=${limit}&offset=${offset}`);
    return response.json();
}

async function render() {
    loading = true;
    let obj = await fetchPictures();
    obj.forEach((x, k) => {
        const m = /W(\d+)H(\d+)/.exec(x.url);
        console.log(halfWidth - 12);
        const height = (halfWidth - 12) / (parseInt(m[1]) / parseInt(m[2]));
        let img = document.createElement('img');
        img.style.width =`100%`;
        img.style.height = `${height}px`;
        img.style.margin = '0 0 8px 0';
        img.style.borderRadius = '8px';
        img.style.flexShrink = '0';
        img.style.objectFit='contain';
        img.src = `https://static.lucidu.cn/images/${x.url}`;
        img.addEventListener('click', evt => {
            const customViewer = document.createElement('custom-viewer');
            customViewer.setAttribute('src', evt.currentTarget.src);
            document.body.appendChild(customViewer);
        })
        if (leftHeight <= rightHeight) {
            leftHeight += height;
            left.appendChild(img);
        } else {
            right.appendChild(img);
            rightHeight += height;
        }
    })
    if (first) {
        observer.observe(loader);
        first = !first;
    } else {
        if (obj.length < limit) {
            observer.unobserve(loader);
        }
    }
    loading = false;

}

render();
const loader = document.getElementById('loader');


let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {


        if (entry.isIntersecting && !loading) {
            offset += limit;
            render();
        }
        // Each entry describes an intersection change for one observed
        // target element:
        //   entry.boundingClientRect
        //   entry.intersectionRatio
        //   entry.intersectionRect
        //   entry.isIntersecting
        //   entry.rootBounds
        //   entry.target
        //   entry.time
    });
});


