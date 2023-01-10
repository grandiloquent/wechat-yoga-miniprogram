(() => {
    const strings = `handlers["/"] = funcs.Home
	handlers["/favicon.ico"] = funcs.Favicon
	handlers["/v1/admin/card"] = funcs.AdminCard
	handlers["/v1/admin/course"] = funcs.AdminCourse
	handlers["/v1/admin/lesson"] = funcs.AdminLesson
	handlers["/v1/admin/market"] = funcs.AdminMarket
	handlers["/v1/admin/notice"] = funcs.AdminNotice
	handlers["/v1/admin/teacher"] = funcs.AdminTeacher
	handlers["/v1/admin/user"] = funcs.AdminUser
	handlers["/v1/debug"] = funcs.Debug
	handlers["/v1/document"] = funcs.Document
	handlers["/v1/picture"] = funcs.Picture
	handlers["/v1/snippet"] = funcs.Snippet
	handlers["/v1/sql"] = funcs.Sql
	handlers["/v1/admin/vipcard"] = funcs.AdminVipcard
	handlers["/v1/login"] = funcs.Login
	handlers["/v1/app"] = funcs.App
	handlers["/v1/book"] = funcs.Book`

    console.log(strings.split('\n')
        .map(v => {
            const pieces = v.split('=');

            return `case "${/(?<=")[^"]+(?=")/.exec(pieces[0])[0]}":
        ${pieces[1].trim()}(w,r,db)
        return`;
        }).join('\n'))
})();