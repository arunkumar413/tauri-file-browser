mod commands;
mod constants;
mod models;
mod services;

pub use constants::DEFAULT_PWD;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_default_pwd() -> String {
    DEFAULT_PWD.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_default_pwd,
            commands::file_system::read_dir,
            commands::file_system::get_home_dir,
            commands::file_system::open_terminal
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
