import React from 'react';
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
} from 'date-fns';

// Format unix timestamp to a short date (YYYY-MM-DD)
const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString();
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getTimeBucket = (timestamp) => {
  if (!timestamp) return 'Unknown';
  const date = new Date(timestamp * 1000);
  const now = new Date();

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return 'This Week';
  if (isSameWeek(date, subWeeks(now, 1))) return 'Last Week';
  if (isThisMonth(date)) return 'This Month';
  if (isSameMonth(date, subMonths(now, 1))) return 'Last Month';
  if (isThisYear(date)) return 'This Year';
  if (isSameYear(date, subYears(now, 1))) return 'Last Year';
  return 'Older';
};

export default function Table({ files, sortOption, onFolderDoubleClick }) {
  // If no files, just return empty state
  if (!files || files.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        No files to display.
      </div>
    );
  }

  // Sort files by the selected sortOption (created, modified, accessed)
  const sortedFiles = [...files].sort((a, b) => {
    let propA, propB;
    if (sortOption === 'date-created') {
      propA = a.created || 0;
      propB = b.created || 0;
    } else if (sortOption === 'date-accessed') {
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
    if (sortOption === 'date-created') timestamp = file.created;
    if (sortOption === 'date-accessed') timestamp = file.accessed;

    const bucketKey = getTimeBucket(timestamp);
    if (!acc[bucketKey]) {
      acc[bucketKey] = [];
    }
    acc[bucketKey].push(file);
    return acc;
  }, {});

  return (
    <div className="w-full h-full overflow-y-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Size</th>
            <th scope="col" className="px-6 py-3">Date Modified</th>
            <th scope="col" className="px-6 py-3">Date Created</th>
            <th scope="col" className="px-6 py-3">Date Accessed</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedFiles).map(([dateLabel, groupFiles]) => (
            <React.Fragment key={dateLabel}>
              <tr className="bg-gray-100/80">
                <td colSpan="6" className="px-6 py-2 font-semibold text-gray-800 text-xs shadow-sm sticky top-10">
                  {dateLabel}
                </td>
              </tr>
              {groupFiles.map((file, idx) => (
                <tr
                  key={`${file.path}-${idx}`}
                  className="bg-white border-b hover:bg-blue-50 cursor-pointer transition-colors"
                  onDoubleClick={() => {
                    if (file.is_dir && onFolderDoubleClick) {
                      onFolderDoubleClick(file.path);
                    }
                  }}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[300px]" title={file.name}>
                    <div className="flex items-center gap-2">
                       {file.is_dir ? '📁' : '📄'} 
                       <span className="truncate">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {file.is_dir ? 'Folder' : 'File'}
                  </td>
                  <td className="px-6 py-4">
                    {file.is_dir ? '-' : formatSize(file.size)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(file.modified)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(file.created)}
                  </td>
                  <td className="px-6 py-4">
                    {formatDate(file.accessed)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
