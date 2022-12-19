package handlers

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
)

func DeleteFilesHandler(w http.ResponseWriter, r *http.Request) {

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
	for _, p := range paths {
		os.RemoveAll(p)
	}
	w.Write([]byte("Success"))
	return
}
