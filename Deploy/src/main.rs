use std::net::TcpStream;
use std::{env, fs};

use ssh_rs::{ssh, LocalSession};
use std::io::prelude::*;
use std::io::{Seek, Write};
use std::iter::Iterator;
use zip::result::ZipError;
use zip::write::FileOptions;

use std::fs::File;
use std::path::Path;
use walkdir::{DirEntry, WalkDir};
// 复制 https://github.com/zip-rs/zip/tree/master/examples
// 项目的示例代码
fn zip_dir<T>(
    it: &mut dyn Iterator<Item = DirEntry>,
    prefix: &str,
    writer: T,
    method: zip::CompressionMethod,
) -> zip::result::ZipResult<()>
where
    T: Write + Seek,
{
    let mut zip = zip::ZipWriter::new(writer);
    let options = FileOptions::default()
        .compression_method(method)
        .unix_permissions(0o755);

    let mut buffer = Vec::new();
    for entry in it {
        let path = entry.path();
        let name = path.strip_prefix(Path::new(prefix)).unwrap();
        let ext = match path.extension() {
            Some(v) => v.to_str().unwrap(),
            None => "",
        };
        if path.is_file() && (ext == "rs" || ext == "toml") {
            #[allow(deprecated)]
            zip.start_file_from_path(name, options)?;
            let mut f = File::open(path)?;

            f.read_to_end(&mut buffer)?;
            zip.write_all(&buffer)?;
            buffer.clear();
        } else if path.is_dir() && !name.as_os_str().is_empty() {
            #[allow(deprecated)]
            zip.add_directory_from_path(name, options)?;
        }
    }
    zip.finish()?;
    Result::Ok(())
}

fn doit(src_dir: &str, dst_file: &str) -> zip::result::ZipResult<()> {
    if !Path::new(src_dir).is_dir() {
        return Err(ZipError::FileNotFound);
    }
    let path = Path::new(dst_file);
    let file = File::create(path).unwrap();

    let walkdir = WalkDir::new(src_dir);
    let it = walkdir.into_iter().filter_entry(|e| {
        !e.path()
            .as_os_str()
            .to_str()
            .unwrap_or("")
            .contains("\\target")
    });

    zip_dir(
        &mut it.filter_map(|e| e.ok()),
        src_dir,
        file,
        zip::CompressionMethod::Stored,
    )?;

    Ok(())
}

fn main() {
    // https://github.com/1148118271/ssh-rs
    ssh::enable_log();
    // 通过环境变量设置
    // 远程服务器公网 IP 和 Ssh 的默认端口22
    // 用户名和登录密码
    let mut session = ssh::create_session()
        .username(env::var("USERNAME").expect("").as_str())
        .password(env::var("PASSWORD").expect("").as_str())
        .connect(env::var("ADDR").expect(""))
        .unwrap()
        .run_local();
    install_rust(&mut session);
    session.close();
}


fn install_rust(session: &mut LocalSession<TcpStream>) {
    // 该命令需要交互操作。可以通过 Visual 
    // Studio Code 的 Remote - SSH 扩展运行
    // 该命令
    let command = "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh";
    let exec = session.open_exec().unwrap();
    let vec: Vec<u8> = exec
        .send_command(command)
        .unwrap();
    println!("{}", String::from_utf8(vec).unwrap());
}

fn upload_server(session: &mut LocalSession<TcpStream>) {
    // 压缩服务器代码的文件路径
    // 如果代码成功上传此文件将被删除
    // 如果失败，在下次运行此程序时
    // 压缩文件也将被覆盖
    let src = "server.zip";
    doit("..\\server", src).expect("Could not ");
    // 上传已压缩的代码
    // 该包不支持上传流
    // 先将代码打包成文件再上传
    let scp = session.open_scp().unwrap();
    scp.upload(src, format!("/root/{}", src).as_str()).unwrap();
    // 文件上传完成后执行解压命令
    let exec = session.open_exec().unwrap();
    let vec: Vec<u8> = exec
        .send_command(format!("unzip -o {} -d server", src).as_str())
        .unwrap();
    println!("{}", String::from_utf8(vec).unwrap());
    let exec = session.open_exec().unwrap();
    let vec: Vec<u8> = exec.send_command("mkdir /root/bin || cd /root/server && cargo build --release && mv target/release/YogaServer /root/bin/YogaServer").unwrap();
    println!("{}", String::from_utf8(vec).unwrap());
    // 删除压缩文件
    let _ = fs::remove_file(src);
}
