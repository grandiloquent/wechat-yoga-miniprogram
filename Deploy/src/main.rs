use std::{env, fs};

use ssh_rs::ssh;
use std::io::prelude::*;
use std::io::{Cursor, Seek, Write};
use std::iter::Iterator;
use zip::result::ZipError;
use zip::write::FileOptions;

use std::fs::File;
use std::path::Path;
use walkdir::{DirEntry, WalkDir};

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
// https://github.com/zip-rs/zip/tree/master/examples
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
    let src = "server.zip";
    doit("..\\server", src).expect("Could not ");

    // https://github.com/1148118271/ssh-rs
    ssh::enable_log();

    let mut session = ssh::create_session()
        .username(env::var("USERNAME").expect("").as_str())
        .password(env::var("PASSWORD").expect("").as_str())
        .connect(env::var("ADDR").expect(""))
        .unwrap()
        .run_local();
    let scp = session.open_scp().unwrap();
    scp.upload(src, format!("/root/{}", src).as_str()).unwrap();
    let exec = session.open_exec().unwrap();
    let vec: Vec<u8> = exec
        .send_command(format!("unzip -o {} -d server", src).as_str())
        .unwrap();
    println!("{}", String::from_utf8(vec).unwrap());
    let exec = session.open_exec().unwrap();
    let vec: Vec<u8> = exec.send_command("ls -all").unwrap();
    println!("{}", String::from_utf8(vec).unwrap());
    session.close();

    let _ = fs::remove_file(src);
}
