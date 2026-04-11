use crate::services::file_service;

#[tauri::command]
pub fn read_dir(path: String) -> Result<Vec<crate::models::file::FileEntry>, String> {
    file_service::read_directory(&path)
}
