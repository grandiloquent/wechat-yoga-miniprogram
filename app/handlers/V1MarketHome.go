package handlers

import (
	"database/sql"
	"net/http"
)
/*
create or replace function v1_market_home() returns json
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
func V1MarketHome(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	QueryJSON(w, db, "select * from v1_market_home()")
}