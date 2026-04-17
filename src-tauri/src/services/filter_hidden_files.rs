use std::fs;

pub fn is_hidden(entry: &fs::DirEntry) -> bool {
    let name = entry.file_name();
    let name = name.to_string_lossy();

    // Unix-style hidden
    if name.starts_with('.') {
        return true;
    }

    // Windows hidden attribute
    #[cfg(windows)]
    {
        use std::os::windows::fs::MetadataExt;
        const FILE_ATTRIBUTE_HIDDEN: u32 = 0x2;

        if let Ok(metadata) = entry.metadata() {
            return metadata.file_attributes() & FILE_ATTRIBUTE_HIDDEN != 0;
        }
    }

    false
}
