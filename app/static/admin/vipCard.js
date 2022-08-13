let baseUri = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:9000' : '';
;
const id = new URL(window.location).searchParams.get('id');
const edit = document.querySelector('#edit');
const qr = document.querySelector('#qr');
const section = document.querySelector('.section');



async function loadData() {
    const response = await fetch(`${baseUri}/api/user.vipcards?id=${id}`);
    return response.json();
}
const h1 = document.querySelector('.h1');


async function render() {
    let obj;
    try {
        obj = await loadData();

        h1.textContent = obj.user.name || obj.user.nick_name;
        document.querySelector('.top img').setAttribute('src', obj.user.avatar_url);
        document.querySelector('.h2').textContent = `${obj.user.phone || '153****3821'}`;
        if (obj.vipCards) {
            obj.vipCards.forEach(x => {

                const template = `<div data-id=${x.id} style="border-bottom: 1px solid #e5e5e5; padding: 12px 0; display: flex; flex-direction: row;">
            
            <svg style="width: 48px; height: 48px; border-radius: 8px; margin-right: 12px;fill:rgb(25, 103, 210)" viewBox="0 0 1024 1024" focusable="false">
                <path d="M910.222336 170.667008c31.403008 0 56.88832 25.486336 56.88832 56.88832v568.889344c0 31.459328-25.485312 56.88832-56.88832 56.88832H113.77664c-31.403008 0-56.88832-25.428992-56.88832-56.88832V227.555328c0-31.401984 25.485312-56.88832 56.88832-56.88832z m0 170.665984H113.77664v455.11168H910.22336V341.332992z m0-113.77664H113.77664v56.88832H910.22336v-56.889344zM245.588992 438.953984h43.350016l66.900992 198.656h1.024l66.900992-198.656h43.350016l-86.699008 243.712h-48.128l-86.699008-243.712z m247.126016 0h39.936v243.712h-39.936v-243.712z m87.721984 0H681.472c58.708992 0 88.404992 24.916992 88.404992 74.752 0 50.176-29.696 75.433984-89.088 75.433984h-60.416v93.526016h-39.936v-243.712z m39.936 34.132992v81.92H678.4c17.748992 0 30.72-3.412992 38.912-9.556992 8.192-6.486016 12.288-17.067008 12.288-31.744 0-14.678016-4.436992-24.918016-12.628992-31.062016C708.779008 476.16 695.808 473.088 678.4 473.088h-58.027008z">
                </path>
            </svg>
                <div style="font-size: 14px; flex-grow: 1;">
                    <div>${x.title}</div>
                    <div style="font-size:12px;color:rgba(3,3,3,.6);margin-top:4px">${secondsToDateString(x.start_date)}-${secondsToDateString(x.end_date)}</div>
                </div>
                <div class="more_vert" data-id=${x.id} 
                    style="display: inline-block; flex-shrink: 0; width: 48px; height: 48px; fill: currentColor; stroke: none; padding: 12px; box-sizing: border-box; color: #030303;">
                    <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                    <path
                        d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z">
                    </path>
                </svg>
                </div>
            </div>`;
                section.insertAdjacentHTML('afterbegin', template);

                /*<svg style="width: 24px; height: 24px;" viewBox="0 0 24 24">
                                        <path
                                            d="M12 15.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 9.984q0.797 0 1.406 0.609t0.609 1.406-0.609 1.406-1.406 0.609-1.406-0.609-0.609-1.406 0.609-1.406 1.406-0.609zM12 8.016q-0.797 0-1.406-0.609t-0.609-1.406 0.609-1.406 1.406-0.609 1.406 0.609 0.609 1.406-0.609 1.406-1.406 0.609z">
                                        </path>
                                    </svg>*/
            });
            const moreVerts = document.querySelectorAll('.more_vert');
            moreVerts.forEach(moreVert => {
                moreVert.addEventListener('click', evt => {
                    const customModalMenu = document.createElement('custom-modal-menu');
                    document.body.appendChild(customModalMenu);
                })
            })
        } else {
            const customEmptyViewer = document.createElement('custom-empty-viewer');
            customEmptyViewer.setAttribute('text', '未找到相关会员卡');
            document.body.appendChild(customEmptyViewer);
        }



    } catch (e) {
        console.log(e)
        document.getElementById('toast').setAttribute('message', '无法加载。');
    }
}

render();



edit.addEventListener('click', evt => {
    window.location = `/admin.vipCard.edit?id=${id}`;

})

const backButton=document.querySelector('.back-button');
backButton.addEventListener('click',evt=>{
            history.back();
        })
