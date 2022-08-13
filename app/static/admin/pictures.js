let baseUri = '';
const customUploader = document.querySelector('custom-uploader');
customUploader.addEventListener('upload', async evt => {
	evt.stopPropagation();
	console.log(evt.detail)
	try {
		await submitPicture({
			url: evt.detail[evt.detail.length-1]
		})
	} catch (e) {
		console.log(e);
	}
});
customUploader.addEventListener('remove', async evt => {
	evt.stopPropagation();
	try {
		await deletePicture(evt.detail);
	} catch (e) {
		console.log(e);
	}
});
async function deletePicture(src) {
	const res = await fetch(`${baseUri}/api/picture?url=${src}`, {
		method: 'DELETE'
	});
	return res.text();
}
async function submitPicture(obj) {
	const response = await fetch(`${baseUri}/api/picture`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(obj)
	});
	return response.text();
}
async function fetchPictures() {
	const response = await fetch(`${baseUri}/api/picture?mode=1&limit=100`);
	return response.json();
}
async function loadData() {
	try {
		const obj = await fetchPictures();
		console.log(obj);
      customUploader.setAttribute('images',JSON.stringify(obj.map(x=>x.url)));
	} catch (e) {
		console.log(e);
	}
}
loadData();