import React from "react";
import {
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  isSameWeek,
  isSameMonth,
  isSameYear,
  subWeeks,
  subMonths,
  subYears,
  format,
} from "date-fns";

// Format unix timestamp to a short date (YYYY-MM-DD)
const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  const d = new Date(timestamp * 1000);
  // return d.toLocaleDateString();
  return format(d, "dd-MMM-yyyy");
};

const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileIcon = (file) => {
  if (file.is_dir) return "📁";
  const name = file.name || "";
  const idx = name.lastIndexOf(".");
  const ext = idx > 0 ? name.substring(idx + 1).toLowerCase() : "";

  switch (ext) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
    case "bmp":
    case "ico":
      return "🖼️";
    case "mp4":
    case "webm":
    case "avi":
    case "mov":
    case "mkv":
      return "🎥";
    case "mp3":
    case "wav":
    case "ogg":
    case "flac":
    case "m4a":
      return "🎵";
    case "pdf":
      return "📕";
    case "doc":
    case "docx":
    case "rtf":
      return "📘";
    case "txt":
    case "md":
      return "📝";
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "py":
    case "rs":
    case "html":
    case "css":
    case "json":
    case "toml":
    case "yaml":
    case "yml":
      return "💻";
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "📦";
    case "csv":
    case "xls":
    case "xlsx":
      return "📊";
    case "ppt":
    case "pptx":
      return "📽️";
    default:
      return "📄";
  }
};

const getTimeBucket = (timestamp) => {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp * 1000);
  const now = new Date();

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return "This Week";
  if (isSameWeek(date, subWeeks(now, 1))) return "Last Week";
  if (isThisMonth(date)) return "This Month";
  if (isSameMonth(date, subMonths(now, 1))) return "Last Month";
  if (isThisYear(date)) return "This Year";
  if (isSameYear(date, subYears(now, 1))) return "Last Year";
  return "Older";
};

export default function Table({ files, sortOption, onFolderDoubleClick }) {
  // If no files, just return empty state
  if (!files || files.length === 0) {
    return (
      <div className="flex flex-1 w-full justify-center items-center h-full text-gray-500">
        No files to display.
      </div>
    );
  }

  // Sort files by the selected sortOption (created, modified, accessed)
  const sortedFiles = [...files].sort((a, b) => {
    let propA, propB;
    if (sortOption === "date-created") {
      propA = a.created || 0;
      propB = b.created || 0;
    } else if (sortOption === "date-accessed") {
      propA = a.accessed || 0;
      propB = b.accessed || 0;
    } else {
      // default: modified
      propA = a.modified || 0;
      propB = b.modified || 0;
    }
    // Sort descending
    return propB - propA;
  });

  // Group by the chronological time buckets
  const groupedFiles = sortedFiles.reduce((acc, file) => {
    let timestamp = file.modified;
    if (sortOption === "date-created") timestamp = file.created;
    if (sortOption === "date-accessed") timestamp = file.accessed;

    const bucketKey = getTimeBucket(timestamp);
    if (!acc[bucketKey]) {
      acc[bucketKey] = [];
    }
    acc[bucketKey].push(file);
    return acc;
  }, {});

  // Sort files within each group by extension, then alphabetically by name
  Object.values(groupedFiles).forEach((groupFiles) => {
    groupFiles.sort((a, b) => {
      const getExt = (name, isDir) => {
        if (isDir) return "";
        const idx = name.lastIndexOf(".");
        return idx > 0 ? name.substring(idx + 1).toLowerCase() : "";
      };

      const extA = getExt(a.name, a.is_dir);
      const extB = getExt(b.name, b.is_dir);

      if (extA < extB) return -1;
      if (extA > extB) return 1;

      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;

      return 0;
    });
  });

  return (
    <div className="w-full h-full flex-1 overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-20 shadow-sm border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3">
              Select
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Type
            </th>
            <th scope="col" className="px-6 py-3">
              Size
            </th>
            <th scope="col" className="px-6 py-3">
              Date Modified
            </th>
            <th scope="col" className="px-6 py-3">
              Date Created
            </th>
            <th scope="col" className="px-6 py-3">
              Date Accessed
            </th>
          </tr>
        </thead>
        {Object.entries(groupedFiles).map(([dateLabel, groupFiles]) => (
          <tbody key={dateLabel} className="bg-sky-900">
            <tr className="bg-gray-50/90">
              <td
                colSpan="8"
                className="px-6 py-2 font-semibold text-gray-800 text-lg shadow-sm sticky top-10 z-10 bg-gray-50/90"
              >
                {dateLabel}
              </td>
            </tr>
            {groupFiles.map((file, idx) => (
              <tr
                key={`${file.path}-${idx}`}
                className="bg-white border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                onDoubleClick={() => {
                  if (file.is_dir && onFolderDoubleClick) {
                    onFolderDoubleClick(file.path);
                  }
                }}
              >
                <td className="px-6 py-2 text-lg text-gray-900">
                  <input type="checkbox" className="w-4 h-4" />
                </td>
                <td
                  className="px-6 py-2 text-lg text-gray-900 truncate max-w-[300px]"
                  title={file.name}
                >
                  <div className="flex items-center gap-2">
                    {/* {getFileIcon(file)}*/}
                    <span className="truncate">{file.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file)}
                    {file.is_dir ? "Folder" : ""}
                    {!file.is_dir
                      ? file.name.slice(
                          ((file.name.lastIndexOf(".") - 1) >>> 0) + 2,
                        )
                      : ""}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {file.is_dir ? "-" : formatSize(file.size)}
                </td>
                <td className="px-6 py-4">{formatDate(file.modified)}</td>
                <td className="px-6 py-4">{formatDate(file.created)}</td>
                <td className="px-6 py-4">{formatDate(file.accessed)}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
