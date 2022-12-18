package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"yg/handlers"

	_ "github.com/lib/pq"
)

func main() {
	dataSourceName := os.Getenv("DATA_SOURCE_NAME")
	if len(dataSourceName) == 0 {
		log.Fatal("Data source name cant be empty!")
	}
	authUrl := os.Getenv("AUTH_URL")
	if len(authUrl) == 0 {
		log.Fatal("Auth url cant be empty!")
	}
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		log.Fatal(err)
	}
	_ = http.ListenAndServe(":8081", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		// /版本/大类/操作
		case "/":
			http.ServeFile(w, r, "./static/index.html")
			return
		case "/favicon.ico":
			handlers.Favicon(db, w, r)
			return
		case "/v1/authorization":
			handlers.V1Authorization(db, w, r, authUrl)
			break
		case "/v1/booked/home":
			handlers.V1BookedHome(db, w, r)
			return
		case "/v1/debug":
			handlers.V1Debug(db, w, r)
			return
		case "/v1/functions/home":
			handlers.V1FunctionsHome(db, w, r)
			return
		case "/v1/market/home":
			handlers.V1MarketHome(db, w, r)
			return
		case "/v1/slideshow/home":
			handlers.V1SlideshowHome(db, w, r)
			return
		case "/v1/teachers/home":
			handlers.V1TeachersHome(db, w, r)
			return
		case "/v1/user/update":
			handlers.V1UserUpdate(db, w, r)
			return
		case "/v1/picture":
			handlers.V1Picture(db, w, r)
			return
		case "/v1/user/user":
			handlers.V1UserUser(db, w, r)
			return

		default:
			http.ServeFile(w, r, "./static"+r.URL.Path)
			return
		}
	}))
}
