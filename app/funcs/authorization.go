package funcs

import (
	"fmt"
	"io"
	"net/http"
)

func Authorization(w http.ResponseWriter, r *http.Request, authUrl string) {
	var code string
	if r.Method == "GET" {
		code = r.URL.Query().Get("code")
	} else {
		buf, err := io.ReadAll(r.Body)
		if checkError(w, err) {
			return
		}
		code = string(buf)
	}
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
