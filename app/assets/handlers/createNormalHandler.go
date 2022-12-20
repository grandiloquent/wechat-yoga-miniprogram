package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path"
	"regexp"
	"strings"
)

func CreateNormalHandler(w http.ResponseWriter, r *http.Request) {
	src := `C:\Users\Administrator\WeChatProjects\yg\app\handlers`
	dst := r.URL.Query().Get("dst")
	s := fmt.Sprintf("/v1/%s", dst)
	name := ToCamel(strings.ReplaceAll(s, "/", "_"))
	f := path.Join(src, name+".go")

	NameName := ToCamel(dst)
	writeFile(f, `package handlers

import (
	""database/sql""
	""net/http""
)
/*
create or replace function ${name}() returns json
    language sql
as
$$
select json_agg(t)
from (
         select id,
                image
         from slideshow
     ) as t
$$;
*/
func ${NameName}(db *sql.DB, w http.ResponseWriter, r *http.Request) {{
    openId := r.URL.Query().Get(""openId"")
	if len(openId) == 0 {{
		http.NotFound(w, r)
    return
	}}
	QueryJSON(w, db, ""select * from ${name}($1)"",openId)
}}");

`, name, NameName)
	s = fmt.Sprintf(`case "%s":
handlers.%s(db,w,r)
return`, s, NameName)

	w.Write([]byte(s))
}
func writeFile(f, s, name, NameName string) {
	ioutil.WriteFile(f, []byte(regexp.MustCompile("\\$\\{[a-zA-Z ]+}").ReplaceAllStringFunc(s, func(s string) string {
		if strings.Index(s, "name") != -1 {
			return name
		}
		if strings.Index(s, "NameName") != -1 {
			return NameName
		}
		return s
	})), 0644)
}
