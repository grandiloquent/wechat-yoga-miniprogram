package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	// 第三方 PostgreSQL 数据库客户端
	_ "github.com/lib/pq"
	"github.com/nfnt/resize"
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
	handlers := make(map[string]func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte))
	handlers["/"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		http.ServeFile(w, r, "./static/index.html")
	}
	handlers["/favicon.ico"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		http.NotFound(w, r)
	}
	handlers["/v1/admin/lesson"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		// 检查是否包含id查询字符串
		// 该逻辑在迭代版本中应该进一步优化
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		// 通过调用数据库自定义函数进行查询操作
		// 成功返回Json，失败空字符串
		QueryJSON(w, db, "select * from v1_admin_lesson($1)", id)
	}
	handlers["/v1/admin/lesson/info"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_lesson_info()")
	}
	handlers["/v1/admin/lessons"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {

		// 待查询课程的起始时间
		start := r.URL.Query().Get("start")
		if len(start) == 0 {
			http.NotFound(w, r)
			return
		}
		// 待查询课程的结束时间
		end := r.URL.Query().Get("end")
		if len(end) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_admin_lessons($1,$2,5)", start, end)
	}
	handlers["/v1/login"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		CrossOrigin(w)
		if r.Method == "OPTIONS" {
			return
		}
		if r.Method != "POST" && r.Method != "GET" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if r.Method == "POST" {
			phoneNumber := r.FormValue("phone_number")
			password := r.FormValue("password")
			row := db.QueryRow("select * from check_user_password($1,$2)", phoneNumber, password)
			if CheckError(w, row.Err()) {
				return
			}
			var id sql.NullString
			err := row.Scan(&id)
			if CheckError(w, err) {
				return
			}
			if !id.Valid {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			buf, err := createToken(secret, id.String)
			if CheckError(w, err) {
				return
			}
			w.Header().Set("Content-Type", "application/jwt")
			w.Write(buf)
		} else {
			if !validToken(db, w, r, secret) {
				return
			}
		}
	}
	handlers["/v1/admin/market"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_market()")
	}
	handlers["/v1/admin/market/update"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		InsertNumber(db, w, r, "select * from v1_admin_market_update($1)")
	}
	handlers["/v1/note"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		CrossOrigin(w)
		if r.Method == "OPTIONS" {
			return
		}
		if r.Method == "GET" {
			id := r.URL.Query().Get("id")
			if len(id) == 0 {
				http.NotFound(w, r)
				return
			}
			QueryJSON(w, db, "select * from v1_admin_note($1)", id)
		} else if r.Method == "POST" {
			if !validToken(db, w, r, secret) {
				return
			}
			InsertNumber(db, w, r, "select * from v1_admin_note_update($1)")
		}
	}
	handlers["/v1/notes"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_notes()")
	}
	handlers["/v1/admin/notice"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_admin_notice($1)", id)
	}
	handlers["/v1/admin/notice/delete"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		id := r.URL.Query().Get("id")
		if len(id) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryInt(w, db, "select * from v1_admin_notice_delete($1)", id)
	}
	handlers["/v1/admin/notice/update"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		InsertNumber(db, w, r, "select * from v1_admin_notice_update($1)")
	}
	handlers["/v1/admin/notices"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_notices()")
	}
	handlers["/v1/admin/users"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_users()")
	}
	handlers["/v1/authorization"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		code := r.URL.Query().Get("code")
		res, err := http.Get(authUrl + code)
		if err != nil {
			writeError(w, err)
			return
		}
		defer func(Body io.ReadCloser) {
			err := Body.Close()
			if err != nil {
				fmt.Printf("V1Authorization: %v\n", err)
			}
		}(res.Body)
		_, _ = io.Copy(w, res.Body)
	}
	handlers["/v1/book"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
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
		QueryJSON(w, db, "select * from v1_book($1,$2)", id, openId)
	}
	handlers["/v1/booked/home"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_booked_home()")
	}
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
	handlers["/v1/debug"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		xforward := r.Header.Get("X-Forwarded-For")
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
		buf, err = QueryRow(db, "select * from v1_debug($1,$2)", string(buf), xforward)
		if CheckError(w, err) {
			return
		}
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.Write(buf)
	}
	handlers["/v1/document"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		CrossOrigin(w)
		name := r.URL.Query().Get("name")
		if len(name) == 0 {
			http.NotFound(w, r)
			return
		}
		buf, err := ioutil.ReadFile("./frontend/" + name + ".md")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.Write(buf)
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
	handlers["/v1/functions/home"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_functions_home()")
	}
	handlers["/v1/market"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_market()")
	}
	handlers["/v1/market/home"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_market_home()")
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
	handlers["/v1/notices/home"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_notices_home()")
	}
	handlers["/v1/picture"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		_ = r.ParseMultipartForm(32 << 20) // 32MB is the default used by FormFile
		fhs := r.MultipartForm.File["images"]
		for _, fh := range fhs {
			f, err := fh.Open()
			// f is one of the files
			if err != nil {
				fmt.Println(err)
				http.NotFound(w, r)
				return
			}
			var originalImage image.Image
			if strings.HasSuffix(fh.Filename, ".png") {
				originalImage, err = png.Decode(f)
			} else if strings.HasSuffix(fh.Filename, ".jpg") {
				originalImage, err = jpeg.Decode(f)
			} else {
				originalImage, _, err = image.Decode(f)
			}

			if err != nil {
				http.NotFound(w, r)
				return
			}
			var m image.Image
			//fmt.Println(originalImage.Bounds().Dx())
			if originalImage.Bounds().Dx() > 1800 {
				m = resize.Resize(1800, 0, originalImage, resize.Lanczos3)
			} else {
				m = originalImage
			}
			_ = os.MkdirAll("static/images", 0644)
			fileName := fmt.Sprintf("%s-%s-W%dH%d%s", GetDateTimeString(), String(6), m.Bounds().Dx(), m.Bounds().Dy(), path.Ext(fh.Filename))
			fullName := fmt.Sprintf("static/images/%s", fileName)
			for FileExists(fullName) {
				fileName = fmt.Sprintf("%s-%s-W%dH%d%s", GetDateTimeString(), String(6), m.Bounds().Dx(), m.Bounds().Dy(), path.Ext(fh.Filename))
				fullName = fmt.Sprintf("static/images/%s", fileName)
			}
			output, err := os.Create(fullName)
			if err != nil {
				http.NotFound(w, r)
				return
			}
			if strings.HasSuffix(fh.Filename, ".png") {
				err = png.Encode(output, m)
				if err != nil {
					_ = output.Close()
					http.NotFound(w, r)
					return
				}
			} else if strings.HasSuffix(fh.Filename, ".jpg") {
				err = jpeg.Encode(output, m, nil)
				if err != nil {
					_ = output.Close()
					http.NotFound(w, r)
					return
				}
			}
			_ = output.Close()
			_, _ = w.Write([]byte(fileName))
		}
	}
	handlers["/v1/slideshow/home"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_slideshow_home()")
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
	handlers["/v1/teachers/home"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_teachers_home()")
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
	handlers["/v1/user/check"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryInt(w, db, "select * from v1_user_check($1)", openId)
	}
	handlers["/v1/user/update"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		InsertNumber(db, w, r, "select * from v1_user_update($1)")
	}
	handlers["/v1/user/user"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		openId := r.URL.Query().Get("openId")
		if len(openId) == 0 {
			http.NotFound(w, r)
			return
		}
		QueryJSON(w, db, "select * from v1_user_user($1)", openId)
	}
	handlers["/v1/admin/lesson/names"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		QueryJSON(w, db, "select * from v1_admin_lesson_names()")
	}
	handlers["/v1/admin/course"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		if r.Method == "GET" {
			id := r.URL.Query().Get("id")
			if len(id) == 0 {
				http.NotFound(w, r)
				return
			}
			QueryJSON(w, db, "select * from v1_admin_course($1)", id)
		} else if r.Method == "POST" {
			InsertNumber(db, w, r, "select * from v1_admin_course_update($1)")
		}
	}
	handlers["/v1/admin/teacher"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		if r.Method == "GET" {
			id := r.URL.Query().Get("id")
			if len(id) == 0 {
				http.NotFound(w, r)
				return
			}
			QueryJSON(w, db, "select * from v1_admin_teacher($1)", id)
		} else if r.Method == "POST" {
			InsertNumber(db, w, r, "select * from v1_admin_teacher_update($1)")
		}
	}
	handlers["/v1/admin/teachers"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {

		QueryJSON(w, db, "select * from v1_admin_teachers()")

	}
	handlers["/v1/admin/lessons/update"] = func(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) {
		InsertNumber(db, w, r, "select * from v1_admin_lessons_update()")
	}
	// 启动服务器并侦听 8081 端口
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
			if !validToken(db, w, r, secret) {
				return
			}
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
func decodeToken(token string, secret []byte) (string, error) {
	if len(token) == 0 {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	pieces := strings.Split(token, "|")
	if len(pieces) < 2 {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	b, err := HmacSha256(secret, pieces[1])
	if err != nil {
		return "", err
	}
	if base64.StdEncoding.EncodeToString(b) != pieces[0] {
		return "", fmt.Errorf("%s", "Invalid Token")
	}
	return pieces[1], nil
}
func checkUserInfo(userinfo string) bool {
	return true
}
func validToken(db *sql.DB, w http.ResponseWriter, r *http.Request, secret []byte) bool {
	token := r.Header.Get("Authorization")
	userinfo, err := decodeToken(token, secret)
	if !checkUserInfo(userinfo) {
		w.WriteHeader(http.StatusForbidden)
		return false
	}
	if CheckError(w, err) {
		return false
	}
	return true
}

func GetDateTimeString() string {
	now := time.Now()
	return fmt.Sprintf("%d%02d%02d-%02d%02d%02d", now.Year(), now.Month(), now.Day(), now.Hour(), now.Minute(), now.Second())
}

const charset = "abcdefghijklmnopqrstuvwxyz" +
	"ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var seededRand *rand.Rand = rand.New(
	rand.NewSource(time.Now().UnixNano()))

func StringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

func String(length int) string {
	return StringWithCharset(length, charset)
}
func HmacSha256(key []byte, data string) ([]byte, error) {
	h := hmac.New(sha256.New, key)
	if _, err := h.Write([]byte(data)); err != nil {
		return nil, err
	}
	return h.Sum(nil), nil
}
func CrossOrigin(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "authorization")
}

// 使用通过环境变量传入键
func createToken(secret []byte, id string) ([]byte, error) {
	s := fmt.Sprintf("%s-%d", id, time.Now().Unix())
	buf, err := HmacSha256(secret, s)
	if err != nil {
		return nil, err
	}
	dst := make([]byte, base64.StdEncoding.EncodedLen(len(buf)))
	base64.StdEncoding.Encode(dst, buf)
	dst = append(dst, []byte("|")...)
	dst = append(dst, []byte(s)...)
	return dst, nil
}

var Secret = []byte{161, 219, 25, 253, 28, 70, 147, 43, 68, 17, 168, 75, 89, 233, 117, 116, 224, 230, 127, 165, 60, 187, 219, 70, 136, 54, 148, 244, 27, 121, 235, 73}

func validCookie(db *sql.DB, w http.ResponseWriter, r *http.Request) bool {
	id := CalculateToken(r)
	if len(id) > 0 {
		QueryJSON(w, db, "select * from _query_userinfo_profile($1)", id)
		return true
	}
	return false
}
func CalculateToken(r *http.Request) string {
	id, err := r.Cookie("Id")
	if err != nil {
		return ""
	}
	token, err := r.Cookie("Token")
	if err != nil {
		return ""
	}
	session, err := HmacSha256(Secret, id.Value)
	if err != nil {
		return ""
	}
	if token.Value == base64.StdEncoding.EncodeToString(session) {

		return id.Value
	}
	return ""
}
func FileExists(name string) bool {
	_, err := os.Stat(name)
	if err == nil {
		return true
	}
	if errors.Is(err, os.ErrNotExist) {
		return false
	}
	return false

}
