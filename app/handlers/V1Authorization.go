package handlers

import (
	"database/sql"
	"fmt"
	"io"
	"net/http"
)

/*

 */
func V1Authorization(db *sql.DB, w http.ResponseWriter, r *http.Request, authUrl string) {
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
