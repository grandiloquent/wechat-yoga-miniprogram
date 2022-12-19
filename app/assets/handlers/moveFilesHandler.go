package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"path"
)

func MoveFilesHandler(w http.ResponseWriter, r *http.Request) {

	var paths []string
	buf, err := ioutil.ReadAll(r.Body)
	if err != nil {
		http.NotFound(w, nil)
		return
	}
	err = json.Unmarshal(buf, &paths)
	if err != nil {
		http.NotFound(w, nil)
		return
	}
	parent := r.URL.Query().Get("dst")
	for _, p := range paths {
		os.Rename(p, path.Join(parent, path.Base(p)))
	}
	w.Write([]byte("Success"))
}
