const setLessonStatus = require('/setLessonStatus');

module.exports = (app,res) => {
	setLessonStatus(res,
		(app.globalData.configs && app.globalData.configs.close_booked) || 3,
		(app.globalData.configs && app.globalData.configs.close_book) || 60);
}
//const setCourseStatus = require('../appointment/setCourseStatus');