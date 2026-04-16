import {
  format,
  isSameMonth,
  isSameWeek,
  isSameYear,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

export function getLastFolder(path) {
  const parts = path.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

// Format unix timestamp to a short date (YYYY-MM-DD)

export const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown";
  const d = new Date(timestamp * 1000);
  return format(d, "dd-MMM-yyyy");
};

export const getTimeBucket = (timestamp) => {
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

export const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
