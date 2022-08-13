let baseUri = "";
// http://localhost:8080
const title = document.getElementById('title');
const subtitle = document.getElementById('subtitle');
const content = document.getElementById('content');
async function loadData() {
	const id = new URL(window.location).searchParams.get('id');
	const response = await fetch(`${baseUri}/api/encyclopedia?mode=2&id=${id}`);
	const obj = await response.json();
	title.textContent = obj.title;
	const t = new Date(obj.update_at * 1000)
	subtitle.textContent = `发布于${t.getFullYear()}年${t.getMonth()+1}月${t.getDate()}日`;
	var md = window.markdownit();
	content.innerHTML = md.render(obj.content);
	const tags = document.getElementById('tags');
	obj.tags.forEach(x => {
		const div = document.createElement('div');
		div.innerHTML = ` <div style="border: 1px solid #dadce0;padding: 2px 12px;border-radius: 16px;">
        ${x}
        </div>`;
		div.addEventListener('click', evt => {
			window.location = `./encyclopedias?mode=1&tag=${x}`
		});
		tags.appendChild(div);
	});
}
loadData();