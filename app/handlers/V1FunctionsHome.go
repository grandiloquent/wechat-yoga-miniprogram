package handlers

import (
	"database/sql"
	"net/http"
)

/*
create or replace function v1_functions_home() returns json
    language sql
as
$$
select json_agg(t)
from (
         select id,
                name,
                image
         from function
         order by id
     ) as t
$$;
*/
func V1FunctionsHome(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	QueryJSON(w, db, "select * from v1_functions_home()")
}
