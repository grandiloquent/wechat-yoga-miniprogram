let baseUri = "";
// http://localhost:8080
const items = document.getElementById('items');
async function loadData() {
	const tag = new URL(window.location).searchParams.get('tag') || '';
	const response = await fetch(`${baseUri}/api/encyclopedia?mode=1&tag=${tag}`);
	const obj = await response.json();
	obj.forEach(x => {
		const div = document.createElement('div');
		const array = x.tags.map(j => {
			return `<a style="border: 1px solid #dadce0;padding: 2px 12px;border-radius: 16px;z-index:2" href="?tag=${j}">
								${j}
							</a>`;
		}).join('');
		div.innerHTML = `
        <div  style="background-color: #fff;margin: 0 0 10px 0;box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);border-radius: 8px;position:relative">
		<a href="./encyclopedia?id=${x.id}" style="position:absolute;top:0;left:0;bottom:0;right:0;z-index:1"></a>
        <div style="display: flex;flex-direction: row-reverse;justify-content: space-between;padding-left: 16px;padding-right: 16px;width: 100%;box-sizing: border-box;position: relative;">
				<div style="display: flex;margin: 16px 0 16px 16px;">
					<img style="border-radius: 8px;background-color: #b2d4fc;height: 92px;width: 92px;" src="${x.thumbnail}">
				</div>
				<div style="padding: 16px 0 40px;">
					<div style="color: #202124;font-size: 12px;font-weight: 400;margin-bottom: 8px;overflow: hidden;text-align: left;text-overflow: ellipsis;white-space: nowrap;line-height: 16px;">
					</div>
					<div style="font-size: medium;color: #202124;font-family: Roboto-Medium, sans-serif;display: -webkit-box;overflow: hidden;-webkit-box-orient: vertical;white-space: normal;">
                    ${x.title}
					</div>
					<div style="font-family: Roboto, Helvetica Neue, Arial, sans-serif;color: #70757a;line-height: 16px;position: absolute;width: calc(100% - 32px);padding: 0 16px;font-size: 12px;overflow: hidden;text-overflow: ellipsis;bottom: 16px;left: 0;">
						<div style="display: flex;font-size: 12px;margin-top: 18px;">
							${array}
						</div>
					</div>
				</div>
			</div>
            
            </div>`;
		items.appendChild(div);
	});
}
loadData();