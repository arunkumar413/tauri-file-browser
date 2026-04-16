export const DEFAULT_FILTERS = {
  all: true,
  img: false,
  video: false,
  pdf: false,
  sheets: false,
  docs: false,
};

export const EXT_ICON_MAP = [
  {
    exts: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"],
    icon: "🖼️",
    type: "img",
  },
  {
    exts: ["mp4", "webm", "avi", "mov", "mkv"],
    icon: "🎥",
    type: "video",
  },
  {
    exts: ["mp3", "wav", "ogg", "flac", "m4a"],
    icon: "🎵",
    type: "audio",
  },
  { exts: ["pdf"], icon: "📕", type: "pdf" },
  { exts: ["doc", "docx", "rtf"], icon: "📘", type: "docs" },
  { exts: ["txt", "md"], icon: "📝", type: "text" },
  {
    exts: [
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "rs",
      "html",
      "css",
      "json",
      "toml",
      "yaml",
      "yml",
    ],
    icon: "💻",
    type: "code",
  },
  { exts: ["zip", "rar", "7z", "tar", "gz"], icon: "📦", type: "archive" },
  { exts: ["csv", "xls", "xlsx"], icon: "📊", type: "sheets" },
  { exts: ["ppt", "pptx"], icon: "📽️", type: "ppt" },
];
