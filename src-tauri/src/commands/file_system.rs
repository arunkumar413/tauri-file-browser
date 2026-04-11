use crate::services::file_service;

#[tauri::command]
pub fn read_dir(path: String) -> Result<Vec<crate::models::file::FileEntry>, String> {
    file_service::read_directory(&path)
}

#[tauri::command]
pub fn get_home_dir() -> Option<String> {
    dirs::home_dir().map(|path| path.to_string_lossy().to_string())
}
