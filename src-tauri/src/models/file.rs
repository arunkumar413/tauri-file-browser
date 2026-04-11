use serde::Serialize;

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
    pub modified: Option<u64>, // timestamp
    pub created: Option<u64>,  // timestamp
    pub accessed: Option<u64>, // timestamp
}
