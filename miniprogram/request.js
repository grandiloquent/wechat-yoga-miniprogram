 
function encyclopedias(host, tag, action) {
	/*
	 request.encyclopedias(app.globalData.host,res=>{
	 });
	 */
	wx.request({
		url: `${host}/api/encyclopedia?mode=1&tag=${tag}`,
		success: res => {
			if (res.statusCode === 200) {
				action(res.data)
			}
		}
	});
}

function encyclopedia(host, id, action) {
	/*
	 request.encyclopedias(app.globalData.host,res=>{
	 });
	 */
	wx.request({
		url: `${host}/api/encyclopedia?mode=2&id=${id}`,
		success: res => {
			if (res.statusCode === 200) {
				action(res.data)
			}
		}
	});
}

function reservations(host,mode,id,openId,startTime,endTime,classType,action) {
	wx.request({
		url: `${host}/api/reservation?mode=${mode}&id=${id||0}&openId=${openId}&startTime=${startTime||0}&endTime=${endTime||0}&classType=${classType||0}`,
		success: res => {
			if (res.statusCode === 200) {
				action(res.data)
			}
		}
	});
}
module.exports = {
	 
	
	encyclopedias,
	encyclopedia,
	reservations
}