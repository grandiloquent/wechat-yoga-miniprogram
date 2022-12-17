package handlers

import (
	"database/sql"
	"net/http"
)

/*
create or replace function v1_teachers_home() returns json
    language sql
as
$$
select json_agg(jsonb_build_object('id', id,
                                   'name', name,
                                   'thumbnail', thumbnail,
                                   'introduction', introduction
    ))
from coach;
$$;
*/

func V1TeachersHome(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	QueryJSON(w, db, "select * from v1_teachers_home()")
}
