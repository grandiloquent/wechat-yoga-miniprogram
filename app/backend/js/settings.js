setHeader();

function setHeader() {
  const customHeader = document.querySelector('custom-header');
  customHeader.setAttribute('title', "管理员");
  [...document.querySelectorAll('[data-href]')].forEach(x => {
    x.addEventListener('click', evt => {
      window.location = evt.currentTarget.dataset.href;
    });
  })
}