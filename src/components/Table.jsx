import React from "react";
import { EXT_ICON_MAP } from "../constants";
import { formatDate, formatSize, getTimeBucket } from "../utils";

const getFileIcon = (file) => {
  if (file.is_dir) return "📁";
  const name = file.name || "";
  const idx = name.lastIndexOf(".");
  const ext = idx > 0 ? name.substring(idx + 1).toLowerCase() : "";

  const match = EXT_ICON_MAP.find((group) => group.exts.includes(ext));
  return match ? match.icon : "📄";
};

export function Table({
  files,
  sortOption,
  onFolderDoubleClick,
  addTab,
  loadDirectory,
  updateTabPath,
}) {
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

            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        {Object.entries(groupedFiles).map(([dateLabel, groupFiles]) => (
          <tbody key={dateLabel} className="">
            <tr className="">
              <td
                colSpan="8"
                className="px-6 py-2 font-semibold text-lg sticky top-10 z-10 bg-white"
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
                    updateTabPath(key, file.path);
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
                {file.is_dir ? (
                  <td
                    onClick={() => {
                      loadDirectory(file.path);
                      addTab(file.path);
                    }}
                    className="px-6 py-4 flex justify-flex-start align-middle gap-2"
                  >
                    <div class="relative group inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        class="cursor-pointer"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M15 3h6v6" />
                        <path d="M10 14 21 3" />
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      </svg>

                      <span class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-100 text-blue-950 text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                        Open in new tab
                      </span>
                    </div>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-trash2-icon lucide-trash-2"
                    >
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
