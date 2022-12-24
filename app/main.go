package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"
	"strings"

	"yg/handlers"

	// 第三方 PostgreSQL 数据库客户端
	_ "github.com/lib/pq"
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
	secretString := os.Getenv("SECRET")
	if len(secretString) == 0 {
		log.Fatal("Secret cant be empty")
	}
	secret := []byte(secretString)
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		log.Fatal(err)
	}

	// 启动服务器并侦听 8081 端口
	_ = http.ListenAndServe(":8081", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		// /版本/大类/操作
		case "/":
			http.ServeFile(w, r, "./static/index.html")
			return
		case "/favicon.ico":
			handlers.Favicon(db, w, r)
			return
		case "/v1/admin/lessons":
			handlers.V1AdminLessons(db, w, r, secret)
			return
		case "/v1/admin/login":
			handlers.V1AdminLogin(db, w, r, secret)
			return
		case "/v1/admin/market":
			handlers.V1AdminMarket(db, w, r, secret)
			return

		case "/v1/admin/market/update":
			handlers.V1AdminMarketUpdate(db, w, r, secret)
			return

		case "/v1/admin/notice":
			handlers.V1AdminNotice(db, w, r, secret)
			return
		case "/v1/admin/notice/update":
			handlers.V1AdminNoticeUpdate(db, w, r, secret)
			return

		case "/v1/admin/notices":
			handlers.V1AdminNotices(db, w, r, secret)
			return
		case "/v1/admin/teacher":
			handlers.V1AdminTeacher(db, w, r, secret)
			return

		case "/v1/admin/teacher/update":
			handlers.V1AdminTeacherUpdate(db, w, r, secret)
			return
		case "/v1/authorization":
			handlers.V1Authorization(db, w, r, authUrl)
			break
		case "/v1/book":
			handlers.V1Book(db, w, r)
			return
		case "/v1/booked/home":
			handlers.V1BookedHome(db, w, r)
			return
		case "/v1/booked/query":
			handlers.V1BookedQuery(db, w, r)
			return
		case "/v1/booking/query":
			handlers.V1BookingQuery(db, w, r)
			return
		case "/v1/debug":
			handlers.V1Debug(db, w, r)
			return
		case "/v1/functions/home":
			handlers.V1FunctionsHome(db, w, r)
			return
		case "/v1/market":
			handlers.V1Market(db, w, r)
			return

		case "/v1/market/home":
			handlers.V1MarketHome(db, w, r)
			return
		case "/v1/notice":
			handlers.V1Notice(db, w, r)
			return
		case "/v1/notices":
			handlers.V1Notices(db, w, r)
			return

		case "/v1/notices/home":
			handlers.V1NoticesHome(db, w, r)
			return
		case "/v1/picture":
			handlers.V1Picture(db, w, r)
			return
		case "/v1/slideshow/home":
			handlers.V1SlideshowHome(db, w, r)
			return
		case "/v1/teacher":
			handlers.V1Teacher(db, w, r)
			return
		case "/v1/teacher/lessons":
			handlers.V1TeacherLessons(db, w, r)
			return
		case "/v1/teachers/home":
			handlers.V1TeachersHome(db, w, r)
			return
		case "/v1/unbook":
			handlers.V1Unbook(db, w, r)
			return
		case "/v1/user/check":
			handlers.V1UserCheck(db, w, r)
			return
		case "/v1/user/update":
			handlers.V1UserUpdate(db, w, r)
			return
		case "/v1/user/user":
			handlers.V1UserUser(db, w, r)
			return

		case "/v1/admin/notice/delete":
			handlers.V1AdminNoticeDelete(db, w, r, secret)
			return

		case "/v1/documents":
			handlers.V1Documents(db, w, r)
			return

		case "/v1/document":
			handlers.V1Document(db, w, r)
			return

		default:
			if strings.Index(r.URL.Path, ".") == -1 {
				http.ServeFile(w, r, "."+r.URL.Path+".html")
			} else {
				http.ServeFile(w, r, "."+r.URL.Path)
			}
			return
		}
	}))
}
