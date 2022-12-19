var dropZone = document.querySelector('body');
        dropZone.addEventListener('dragover', function (e) {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy'
        });
        dropZone.addEventListener('drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
            uploadFiles(e.dataTransfer.files)
        });

        async function uploadFiles(files) {
            document.querySelector('.dialog').className = 'dialog dialog-show';
            const dialogContext = document.querySelector('.dialog-content span');
            const length = files.length;
            let i = 1;
            for (let file of files) {
                dialogContext.textContent = `正在上传 (${i++}/${length}) ${file.name} ...`;
                const formData = new FormData;
                let path = new URL(location.href).searchParams.get('path') || "/storage/emulated/0";
                console.log(path + "/" + file.name)
                formData.append('file', file, encodeURIComponent(path + "/" + file.name));
                try {
                    await fetch(`${baseUri}/post`, {
                        method: "POST",
                        body: formData
                    }).then(res => console.log(res))
                } catch (e) {
                }
            }
            document.querySelector('.dialog').className = 'dialog'
        }

        customBarRenderer.addEventListener('submit-sort', evt => {
            evt.stopPropagation();
            const customSort = document.createElement('custom-sort');
            document.body.appendChild(customSort);
            customSort.addEventListener('submit', evt => {
                customSort.remove();
                render(parseInt(evt.detail) + 1);
                localStorage.setItem('sort', parseInt(evt.detail) + 1)
            });
        });

        