use std::net::{IpAddr, Ipv4Addr, Ipv6Addr};

use rocket::{
    outcome::Outcome,
    request::{self, FromRequest, Request},
};

/// The request guard used for getting an IP address from a client.
#[derive(Debug, Clone)]
pub struct ClientRealAddr {
    /// IP address from a client.
    pub ip: IpAddr,
}

fn from_request(request: &Request<'_>) -> Option<ClientRealAddr> {
    match request.real_ip() {
        Some(ip) => Some(ClientRealAddr {
            ip,
        }),
        None => {
            let forwarded_for_ip: Option<&str> = request.headers().get("x-forwarded-for").next(); // Only fetch the first one.

            match forwarded_for_ip {
                Some(forwarded_for_ip) => {
                    let forwarded_for_ip = forwarded_for_ip.split(',').next(); // Only fetch the first one.

                    match forwarded_for_ip {
                        Some(forwarded_for_ip) => match forwarded_for_ip.trim().parse::<IpAddr>() {
                            Ok(ip) => Some(ClientRealAddr {
                                ip,
                            }),
                            Err(_) => request.remote().map(|addr| ClientRealAddr {
                                ip: addr.ip()
                            }),
                        },
                        None => request.remote().map(|addr| ClientRealAddr {
                            ip: addr.ip()
                        }),
                    }
                },
                None => request.remote().map(|addr| ClientRealAddr {
                    ip: addr.ip()
                }),
            }
        },
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for ClientRealAddr {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        match from_request(request) {
            Some(client_addr) => Outcome::Success(client_addr),
            None => Outcome::Forward(()),
        }
    }
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for &'r ClientRealAddr {
    type Error = ();

    async fn from_request(request: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        let cache: &Option<ClientRealAddr> = request.local_cache(|| from_request(request));

        match cache.as_ref() {
            Some(client_addr) => Outcome::Success(client_addr),
            None => Outcome::Forward(()),
        }
    }
}

impl ClientRealAddr {
    /// Get an `Ipv4Addr` instance.
    pub fn get_ipv4(&self) -> Option<Ipv4Addr> {
        match &self.ip {
            IpAddr::V4(ipv4) => Some(*ipv4),
            IpAddr::V6(ipv6) => ipv6.to_ipv4(),
        }
    }

    /// Get an IPv4 string.
    pub fn get_ipv4_string(&self) -> Option<String> {
        match &self.ip {
            IpAddr::V4(ipv4) => Some(ipv4.to_string()),
            IpAddr::V6(ipv6) => ipv6.to_ipv4().map(|ipv6| ipv6.to_string()),
        }
    }

    /// Get an `Ipv6Addr` instance.
    pub fn get_ipv6(&self) -> Ipv6Addr {
        match &self.ip {
            IpAddr::V4(ipv4) => ipv4.to_ipv6_mapped(),
            IpAddr::V6(ipv6) => *ipv6,
        }
    }

    /// Get an IPv6 string.
    pub fn get_ipv6_string(&self) -> String {
        match &self.ip {
            IpAddr::V4(ipv4) => ipv4.to_ipv6_mapped().to_string(),
            IpAddr::V6(ipv6) => ipv6.to_string(),
        }
    }
}