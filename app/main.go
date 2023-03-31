package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	// 第三方 PostgreSQL 数据库客户端
	"yg/cron"

	_ "github.com/lib/pq"

	"yg/funcs"
)

func main() {

	// 包含连接数据库的字符串的环境变量
	// 例如：host=数据库公网IP port=数据库侦听端口 user=数据库用户名 password=数据库密码 dbname=数据库名称 sslmode=disable
	dataSourceName := os.Getenv("DATA_SOURCE_NAME")
	if len(dataSourceName) == 0 {
		log.Fatal("Data source name cant be empty!")
	}
	// 包含微信鉴权 URL 的环境变量
	// https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/api/others/WeChat_login.html
	authUrl := os.Getenv("AUTH_URL")
	if len(authUrl) == 0 {
		log.Fatal("Auth url cant be empty!")
	}
	/*
	   用于计算登录令牌的长度为32的字符串
	*/
	secretString := os.Getenv("SECRET")
	if len(secretString) == 0 {
		log.Fatal("Secret cant be empty")
	}
	secret := []byte(secretString)
	/*
	   连接 PostgreSQL 数据库
	*/
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		log.Fatal(err)
	}
	/*
	   自动化任务
	*/
	//bj, _ := time.LoadLocation("Asia/Chongqing")
	// cron.WithLocation(bj)
	c := cron.New()
	/*
	   每天 8 点检查当日的课程
	   自动取消约课人数不足3人的课程，将hidden字段设置为 -1
	   并且将该课程的预约 fulfill 设置为 -1
	*/
	c.AddFunc("0 8 * * *", func() {
		_, err := db.Exec("select * from check_today_lessons()")
		if err != nil {
			log.Println(err.Error())
			return
		}
		log.Println("检查今日课程")
	})
	/*
	   每天 9 点检查会员卡
	*/
	c.AddFunc("0 9 * * *", func() {
		_, err := db.Exec("select * from check_vip_card_status()")
		if err != nil {
			log.Println(err.Error())
			return
		}
		log.Println("检查会员卡")
	})
	c.AddFunc("30 6 * * *", func() {
		_, err := db.Exec("select * from check_today_lessons()")
		if err != nil {
			log.Println(err.Error())
			return
		}
		log.Println("检查今日课程")
	})
	c.AddFunc("30 7 * * *", func() {
		_, err := db.Exec("select * from check_vip_card_status()")
		if err != nil {
			log.Println(err.Error())
			return
		}
		log.Println("检查会员卡")
	})
	c.Start()
	/*以请求连接为键的处理器

	 */
	handlers := make(map[string]func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte))
	/*
	   首页
	*/

	handlers["/v1/booked/query"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		startTime := r.URL.Query().Get("startTime")
		if len(startTime) == 0 {
			http.NotFound(w, r)
			return
		}
		endTime := r.URL.Query().Get("endTime")
		if len(endTime) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_booked_query($1,$2,$3)", openId, startTime, endTime)
	}
	handlers["/v1/booking/query"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		start := r.URL.Query().Get("start")
		if len(start) == 0 {
			http.NotFound(w, r)
			return
		}
		classType := r.URL.Query().Get("classType")
		if len(classType) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_booking_query($1,$2,$3)", start, openId, classType)
	}

	handlers["/v1/documents"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		CrossOrigin(w)
		files, err := ioutil.ReadDir("./frontend")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		var array []map[string]interface{}
		for i := 0; i < len(files); i++ {
			if !files[i].IsDir() && strings.HasSuffix(files[i].Name(), ".md") {
				m := make(map[string]interface{})
				n := files[i].Name()
				m["name"] = n[:strings.LastIndex(n, ".")]
				m["time"] = files[i].ModTime().Unix()
				array = append(array, m)
			}
		}
		buf, err := json.Marshal(array)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(buf)
	}

	handlers["/v1/market"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_market()")
	}
	handlers["/v1/note"] = funcs.Note
	handlers["/v1/notes"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_notes()")
	}
	handlers["/v1/notice"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_notice($1)", id)
	}
	handlers["/v1/notices"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_notices()")
	}

	handlers["/v1/teacher"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_teacher($1)", id)
	}
	handlers["/v1/teacher/lessons"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		teacherId := r.URL.Query().Get("teacherId")
		if len(teacherId) == 0 {
			http.NotFound(w, r)
			return
		}
		startTime := r.URL.Query().Get("startTime")
		if len(startTime) == 0 {
			http.NotFound(w, r)
			return
		}
		endTime := r.URL.Query().Get("endTime")
		if len(endTime) == 0 {
			http.NotFound(w, r)
			return
		}
		classType := r.URL.Query().Get("classType")
		if len(classType) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_teacher_lessons($1,$2,$3,$4,$5)", startTime, endTime, openId, classType, teacherId)
	}

	handlers["/v1/unbook"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryInt(w, db, "select * from v1_unbook($1,$2)", id, openId)
	}

	// 启动服务器并侦听 8082 端口
	_ = http.ListenAndServe(":8081", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if strings.HasPrefix(r.URL.Path, "/v1/admin/") {
			// 启用跨域，便于本地测试
			CrossOrigin(w)
			// 如果请求头包含敏感信息浏览器会发送请求预检
			if r.Method == "OPTIONS" {
				return
			}

			// 验证权限
			// secret 是用于计算Hash的长度为32的字节数组
			if !funcs.ValidToken(db, w, r, secret) {
				return
			}
		}
		switch r.URL.Path {

		case "/":
			funcs.Home(w, r)
			return
		case "/favicon.ico":
			funcs.Favicon(w, r)
			return
		case "/v1/admin/card":
			funcs.AdminCard(w, r, db)
			return
		case "/v1/admin/course":
			funcs.AdminCourse(w, r, db)
			return
		case "/v1/admin/lesson":
			funcs.AdminLesson(w, r, db)
			return
		case "/v1/admin/market":
			funcs.AdminMarket(w, r, db)
			return
		case "/v1/admin/notice":
			funcs.AdminNotice(w, r, db)
			return
		case "/v1/admin/teacher":
			funcs.AdminTeacher(w, r, db)
			return
		case "/v1/admin/user":
			funcs.AdminUser(w, r, db)
			return
		case "/v1/admin/vipcard":
			funcs.AdminVipcard(w, r, db)
			return
		case "/v1/admin/weeks":
			funcs.AdminWeeks(w, r, db)
			return
		case "/v1/app":
			funcs.App(w, r, db)
			return
		case "/v1/authorization":
			funcs.Authorization(w, r, authUrl)
			return
		case "/v1/book":
			funcs.Book(w, r, db)
			return
		case "/v1/debug":
			funcs.Debug(w, r, db)
			return
		case "/v1/document":
			funcs.Document(w, r, db)
			return
		case "/v1/login":
			funcs.Login(w, r, db, secret)
			return
		case "/v1/picture":
			funcs.Picture(w, r)
			return
		case "/v1/snippet":
			funcs.Snippet(w, r, db)
			return
		case "/v1/sql":
			funcs.Sql(w, r, db, secret)
			return
		case "/v1/user":
			funcs.User(w, r, db)
			return
		}
		f := handlers[r.URL.Path]
		if f != nil {
			f(db, w, r, secret)
			return
		}

		if strings.Index(r.URL.Path, ".") == -1 {
			http.ServeFile(w, r, "."+r.URL.Path+".html")
		} else {
			if strings.HasSuffix(r.URL.Path, ".js") {
				w.Header().Set("Content-Type", "application/javascript")
			}
			http.ServeFile(w, r, "."+r.URL.Path)
		}

	}))
}

func QueryJSON(w http.ResponseWriter, db *sql.DB, query string, args ...any) {
	buf, err := QueryRow(db, query, args...)
	// 如果查询错误，则返回500状态码和发生错误的原因。但暴露过多信息，可能会影响服务器的安全性，在服务器稳定后，应该仅返回无意义的错误提示
	if CheckError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Write(buf)
}

func CheckError(w http.ResponseWriter, err error) bool {
	if err != nil {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
		w.Header().Set("X-Content-Type-Options", "nosniff")
		// https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status
		w.WriteHeader(500)
		fmt.Fprintln(w, err)
		return true
	}
	return false
}

// 执行数据库服务端返回JSON的函数
// 例如 select * from f($1)，函数查询参数以美元符号加以1开头的递增序列表示
func QueryRow(db *sql.DB, query string, args ...any) ([]byte, error) {
	row := db.QueryRow(query, args...)
	if row.Err() != nil {
		return nil, row.Err()
	}
	// 读取返回的JSON字节数据
	var buf []byte
	err := row.Scan(&buf)
	if err != nil {
		return nil, err
	}
	return buf, nil
}
func InsertNumber(db *sql.DB, w http.ResponseWriter, r *http.Request, query string) {
	buf, err := io.ReadAll(r.Body)
	if CheckError(w, err) {
		return
	}
	if len(buf) == 0 {
		http.NotFound(w, r)
		return
	}
	var data interface{}
	err = json.Unmarshal(buf, &data)
	if CheckError(w, err) {
		return
	}
	buf, err = QueryRow(db, query, string(buf))
	if CheckError(w, err) {
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Write(buf)
}
func QueryInt(w http.ResponseWriter, db *sql.DB, query string, args ...any) {
	row := db.QueryRow(query, args...)
	if CheckError(w, row.Err()) {
		return
	}
	// 读取返回的JSON字节数据
	var buf sql.NullInt32
	err := row.Scan(&buf)
	if CheckError(w, err) {
		return
	}
	if buf.Valid {
		w.Write([]byte(fmt.Sprintf("%d", buf.Int32)))
	} else {
		http.NotFound(w, nil)
	}
}
func writeError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(500)
	fmt.Fprintln(w, err)
}

func CrossOrigin(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "authorization")
}

/*
测试文件是否存在
*/

func getId(w http.ResponseWriter, r *http.Request) string {
	return getInt("id", w, r)
}
func getInt(key string, w http.ResponseWriter, r *http.Request) string {
	id := r.URL.Query().Get(key)
	j := len(id)
	if j == 0 {
		http.Error(w, "Bad Id", http.StatusBadRequest)
		return ""
	}
	for i := 0; i < j; i++ {
		if id[i] > 57 || id[i] < 48 {
			http.Error(w, "Bad Id", http.StatusBadRequest)
			return ""
		}
	}
	return id
}
