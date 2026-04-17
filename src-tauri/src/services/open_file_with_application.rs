use std::process::Command;

#[cfg(target_os = "linux")]
pub fn open_terminal(path: String) {
    #[cfg(target_os = "linux")]
    Command::new("x-terminal-emulator")
        .current_dir(&path)
        .spawn()
        .unwrap();

    #[cfg(target_os = "macos")]
    Command::new("open")
        .arg("-a")
        .arg("Terminal")
        .spawn()
        .unwrap();

    #[cfg(target_os = "windows")]
    Command::new("cmd").spawn().unwrap();
}
