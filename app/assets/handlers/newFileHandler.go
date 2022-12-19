package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path"
)

func NewFileHandler(w http.ResponseWriter, r *http.Request) {
	src := r.URL.Query().Get("src")
	if _, err := os.Stat(src); os.IsNotExist(err) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		w.WriteHeader(404)
		fmt.Fprintf(w, "%s", src)
		return
	}
	dst := r.URL.Query().Get("dst")
	dst = path.Join(src, dst)
	if _, err := os.Stat(dst); os.IsNotExist(err) {
		f, err := os.Create(dst)
		if err != nil {
			w.Header().Set("Content-Type", "text/plain; charset=utf-8")
			w.WriteHeader(404)
			fmt.Fprintf(w, "%s", src)
			return
		}
		defer f.Close()
		w.Write([]byte("Success"))
		return
	}
	w.Header().Set("Content-Type", "text/plain; charset=utf-8")
	w.WriteHeader(404)
	fmt.Fprintf(w, "%s", src)
}
