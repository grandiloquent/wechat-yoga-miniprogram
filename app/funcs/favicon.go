package funcs

import (
	"net/http"
)

func Favicon(w http.ResponseWriter, r *http.Request) {
	http.NotFound(w, r)
}
