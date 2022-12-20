package handlers

import (
	""database/sql""
	""net/http""
)
/*
create or replace function V1BookingQuery() returns json
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
func Bookingquery(db *sql.DB, w http.ResponseWriter, r *http.Request) {{
    openId := r.URL.Query().Get(""openId"")
	if len(openId) == 0 {{
		http.NotFound(w, r)
    return
	}}
	QueryJSON(w, db, ""select * from V1BookingQuery($1)"",openId)
}}");

