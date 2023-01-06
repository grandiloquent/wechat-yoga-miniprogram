const SETTINGS = {
  title: '晨蕴瑜伽',
  cdn: "https://chenyunyoga.cn",
  host: "http://127.0.0.1:8082"
};

document.querySelectorAll('[bind]').forEach(element => {
  if (element.getAttribute('bind')) {
    window[element.getAttribute('bind')] = element;
  }
  [...element.attributes].filter(attr => attr.nodeName.startsWith('@')).forEach(attr => {
    if (!attr.value) return;
    element.addEventListener(attr.nodeName.slice(1), evt => {
      window[attr.value](evt);
    });
  });
})
document.title = `${document.title} - ${SETTINGS.title}`;

function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}