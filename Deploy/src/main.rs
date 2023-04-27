use std::env;

use ssh_rs::ssh;

fn main() {
    ssh::enable_log();

    let mut session = ssh::create_session()
        .username(env::var("USERNAME").unwrap().as_str())
        .password(env::var("PASSWORD").unwrap().as_str())
        .connect(env::var("ADDR").unwrap())
        .unwrap()
        .run_local();
    let exec = session.open_exec().unwrap();
    let vec: Vec<u8> = exec.send_command("ls -all").unwrap();
    println!("{}", String::from_utf8(vec).unwrap());
    // Close session.
    session.close();
}