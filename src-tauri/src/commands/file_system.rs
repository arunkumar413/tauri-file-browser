use crate::services::{file_service, open_file_with_application};

#[tauri::command]
pub fn read_dir(path: String) -> Result<Vec<crate::models::file::FileEntry>, String> {
    file_service::read_directory(&path, false)
}

#[tauri::command]
pub fn get_home_dir() -> Option<String> {
    dirs::home_dir().map(|path| path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn open_terminal(path: String) {
    open_file_with_application::open_terminal(path);
}
