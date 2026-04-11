use std::fs;
use crate::models::file::FileEntry;
use std::time::UNIX_EPOCH;

pub fn read_directory(path: &str) -> Result<Vec<FileEntry>, String> {
    let mut entries = Vec::new();

    let dir = fs::read_dir(path).map_err(|e| e.to_string())?;

    for entry in dir {
        let entry = entry.map_err(|e| e.to_string())?;
        let metadata = entry.metadata().map_err(|e| e.to_string())?;
        
        let name = entry.file_name().into_string().unwrap_or_else(|_| String::from("unknown"));
        let path = entry.path().to_string_lossy().into_owned();
        let is_dir = metadata.is_dir();
        let size = metadata.len();
        
        let modified = match metadata.modified() {
            Ok(time) => time.duration_since(UNIX_EPOCH).ok().map(|d| d.as_secs()),
            Err(_) => None,
        };
        let created = match metadata.created() {
            Ok(time) => time.duration_since(UNIX_EPOCH).ok().map(|d| d.as_secs()),
            Err(_) => None,
        };
        let accessed = match metadata.accessed() {
            Ok(time) => time.duration_since(UNIX_EPOCH).ok().map(|d| d.as_secs()),
            Err(_) => None,
        };

        entries.push(FileEntry {
            name,
            path,
            is_dir,
            size,
            modified,
            created,
            accessed,
        });
    }

    Ok(entries)
}