package main

import (
	"assets/handlers"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"path"
	"regexp"
	"strings"
)

func main() {
	dataSourceName, _ := ioutil.ReadFile("dataSourceName.txt")
	db, err := sql.Open("postgres", string(dataSourceName))
	if err != nil {
		log.Fatal(err)
	}
	_ = http.ListenAndServe(":8000", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/api/wechatpage":
			handlers.WeChatPageHandler(w, r)
			return
		case "/api/wechatcomponents":
			handlers.WeChatComponentsHandler(w, r)
			return
		case "/api/handler":
			handlers.CreateNormalHandler(w, r)
			return
		case "/api/unzip":
			handlers.UnzipHandler(w, r)
			return
		case "/api/save":
			handlers.SaveHandler(w, r)
			return
		case "/api/delete":
			handlers.DeleteFilesHandler(w, r)
			return
		case "/api/files":
			handlers.ListFilesHandler(w, r)
			return
		case "/api/move":
			handlers.MoveFilesHandler(w, r)
			return
		case "/api/newfile":
			handlers.NewFileHandler(w, r)
			return
		case "/api/newfolder":
			handlers.NewFolderHandler(w, r)
			return
		case "/api/rename":
			handlers.RenameFileHandler(w, r)
			return
		case "/api/tidy":
			handlers.TidyFilesHandler(w, r)
			return
		case "/api/sql":
			handlers.SQLHandler(w, r, db)
			return
		}
		if staticFiles(w, r) {
			return
		}
		http.NotFound(w, r)
	}))
}
func staticFiles(w http.ResponseWriter, r *http.Request) bool {
	var filename string
	if r.URL.Path == "/" {
		filename = "files/index.html"
	}
	if r.URL.Path == "/editor" {
		filename = "files/editor.html"
	}
	if r.URL.Path == "/video" {
		filename = "files/video.html"
	}
	if strings.HasSuffix(r.URL.Path, "svg") {
		filename = r.URL.Path[1:]
	} else if strings.HasSuffix(r.URL.Path, "vtt") {
		filename = r.URL.Path[1:]
		fmt.Println(filename)
	} else if m, _ := regexp.MatchString("\\.(?:js|css|png|html|jpg)$", r.URL.Path); m {
		filename = "files/" + r.URL.Path[1:]
	}
	if len(filename) > 0 {
		if !handlers.CheckFileExists(filename) {
			referer := r.Header.Get("Referer")
			if len(referer) > 0 {
				u, err := url.Parse(referer)
				if err == nil && len(filename) > 3 {
					filename = path.Dir(u.Query().Get("path")) + "/" + strings.Split(filename, "/api/")[1:][0]
				}
			}
		}
		http.ServeFile(w, r, filename)
		return true
	}
	return false
}

// go build -o m.exe
