package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		d, err := httputil.DumpRequest(r, true)
		if err != nil {
			msg := fmt.Sprintf("couldn't dump request: %s", err)
			log.Printf(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}

		b := string(d)

		log.Printf("request received:\n%s\n\n", b)

		if _, err := fmt.Fprintf(w, b); err != nil {
			msg := fmt.Sprintf("couldn't write response: %s", err)
			log.Printf(msg)
			http.Error(w, msg, http.StatusInternalServerError)
			return
		}
	})



	addr := ":8002" 

	log.Printf("http-dump is listening at %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}