use deadpool_postgres::{GenericClient, Object};
use std::error::Error;
use std::fmt::{Debug, Formatter};
use tokio_postgres::types::{FromSql, Type, ToSql, IsNull, to_sql_checked};
use tokio_postgres::types::private::BytesMut;

#[derive(Debug, PartialEq)]
pub struct Simple(pub Vec<u8>);

impl<'a> FromSql<'a> for Simple {
    fn from_sql(ty: &Type, raw: &[u8]) -> Result<Self, Box<dyn Error + Sync + Send>> {
        Vec::<u8>::from_sql(ty, raw).map(Simple)
    }
    fn accepts(_ty: &Type) -> bool {
        true
    }
}

pub struct Body(pub String);

impl Debug for Body {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        todo!()
    }
}

impl ToSql for Body {
    fn to_sql(&self, ty: &Type, w: &mut BytesMut) -> Result<IsNull, Box<dyn Error + Sync + Send>> {
        <&str as ToSql>::to_sql(&&self.0.as_str(), ty, w)
    }

    fn accepts(ty: &Type) -> bool {
        true
    }

    to_sql_checked!();
}
pub async fn query_json_with_id(
    conn: &Object,
    id: i32,
    statement: &str,
) -> Result<Simple, tokio_postgres::Error> {
    // https://docs.rs/tokio-postgres/latest/tokio_postgres/row/struct.Row.html
    // https://docs.rs/tokio-postgres/latest/tokio_postgres/types/struct.Json.html
    conn.query_one(statement, &[&id]).await?.try_get(0)
}

pub async fn query_json(
    conn: &Object,
    statement: &str,
) -> Result<Simple, tokio_postgres::Error> {
    conn.query_one(statement, &[]).await?.try_get(0)
}

pub async fn query_json_with_params(
    conn: &Object,
    statement: &str,
    params: &[&(dyn ToSql + Sync)],
) -> Result<Simple, tokio_postgres::Error>
{
    conn.query_one(statement, params).await?.try_get(0)
}

pub async fn query_int_with_params(
    conn: &Object,
    statement: &str,
    params: &[&(dyn ToSql + Sync)],
) -> Result<i32, tokio_postgres::Error> {
    conn.query_one(statement, params).await?.try_get(0)
}

