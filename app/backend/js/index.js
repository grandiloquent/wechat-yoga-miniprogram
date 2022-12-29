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
customActions.data= [{
        path: ` <path d="M0 0h24v24H0V0z" fill="none"></path>
        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z">
        </path>`,
        title: '课程',
        href: 'lessons'
      },
      {
        path:`<path d="M20.016 21v-12.984h-16.031v12.984h16.031zM20.016 3q0.797 0 1.383 0.609t0.586 1.406v15.984q0 0.797-0.586 1.406t-1.383 0.609h-16.031q-0.797 0-1.383-0.609t-0.586-1.406v-15.984q0-0.797 0.586-1.406t1.383-0.609h1.031v-2.016h1.969v2.016h10.031v-2.016h1.969v2.016h1.031z">
        </path>`,
        title: '课表',
        href: 'image'
      },
      {
        path: `<path d="M18.984 20.016v-11.016h-13.969v11.016h13.969zM18.984 3.984q0.797 0 1.406 0.609t0.609 1.406v14.016q0 0.797-0.609 1.383t-1.406 0.586h-13.969q-0.844 0-1.43-0.563t-0.586-1.406v-14.016q0-0.797 0.586-1.406t1.43-0.609h0.984v-1.969h2.016v1.969h7.969v-1.969h2.016v1.969h0.984zM17.016 11.016v1.969h-2.016v-1.969h2.016zM12.984 11.016v1.969h-1.969v-1.969h1.969zM9 11.016v1.969h-2.016v-1.969h2.016z">
        </path>`,
        title: '排课',
        href: 'schedule'
      },  {
        path: `<path d="M12 14.016q2.531 0 5.273 1.102t2.742 2.883v2.016h-16.031v-2.016q0-1.781 2.742-2.883t5.273-1.102zM12 12q-1.641 0-2.813-1.172t-1.172-2.813 1.172-2.836 2.813-1.195 2.813 1.195 1.172 2.836-1.172 2.813-2.813 1.172z">
        </path>`,
        title: '老师',
        href: 'teachers'
      }, {
        path: `<path d="M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z" />`,
        title: '会员',
        href: 'users'
      }, {
        path: `<path d="M12 15.516q1.453 0 2.484-1.031t1.031-2.484-1.031-2.484-2.484-1.031-2.484 1.031-1.031 2.484 1.031 2.484 2.484 1.031zM19.453 12.984l2.109 1.641q0.328 0.234 0.094 0.656l-2.016 3.469q-0.188 0.328-0.609 0.188l-2.484-0.984q-0.984 0.703-1.688 0.984l-0.375 2.625q-0.094 0.422-0.469 0.422h-4.031q-0.375 0-0.469-0.422l-0.375-2.625q-0.891-0.375-1.688-0.984l-2.484 0.984q-0.422 0.141-0.609-0.188l-2.016-3.469q-0.234-0.422 0.094-0.656l2.109-1.641q-0.047-0.328-0.047-0.984t0.047-0.984l-2.109-1.641q-0.328-0.234-0.094-0.656l2.016-3.469q0.188-0.328 0.609-0.188l2.484 0.984q0.984-0.703 1.688-0.984l0.375-2.625q0.094-0.422 0.469-0.422h4.031q0.375 0 0.469 0.422l0.375 2.625q0.891 0.375 1.688 0.984l2.484-0.984q0.422-0.141 0.609 0.188l2.016 3.469q0.234 0.422-0.094 0.656l-2.109 1.641q0.047 0.328 0.047 0.984t-0.047 0.984z">
        </path>`,
        title: '设置',
        href: 'settings'
      }
    ];
function showDrawer(evt) {
  evt.stopPropagation();
  customDrawer.setAttribute('expand', 'true');
}

let baseUri = window.location.host === "127.0.0.1:5500" ? 'http://127.0.0.1:8081' : ''
async function loadData() {
  const response = await fetch(`${baseUri}/v1/login`, {
    headers: {
      "Authorization": window.localStorage.getItem("Authorization")
    }
  })
  return response.text();
}
async function render() {
  try {
    await loadData()
  } catch (error) {
console.log(error);
   window.location = `/backend/login?returns=${encodeURIComponent(window.location.href)}`
  }
}
render();