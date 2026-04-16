import { useState, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Table } from "./Table";
import "../App.css";
import { DEFAULT_FILTERS } from "../constants";
import { Grid } from "./Grid";

export function Tab(props) {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState();
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date-modified");
  const [baseDir, setBaseDir] = useState("/home");
  const [view, setView] = useState("table");

  const bookmarks = [
    { name: "Home", path: baseDir },
    { name: "Desktop", path: `${baseDir}/Desktop` },
    { name: "Documents", path: `${baseDir}/Documents` },
    { name: "Downloads", path: `${baseDir}/Downloads` },
    { name: "Music", path: `${baseDir}/Music` },
    { name: "Pictures", path: `${baseDir}/Pictures` },
    { name: "Videos", path: `${baseDir}/Videos` },
    { name: "Trash", path: `${baseDir}/.local/share/Trash/files` },
  ];

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loadDirectory = async (targetPath, addToHistory = true) => {
    try {
      const resFiles = await invoke("read_dir", { path: targetPath });

      if (addToHistory && path) {
        setHistory((prev) => [...prev, path]);
      }

      setPath(targetPath);
      setFiles(resFiles);
      setSearchQuery(""); // Optionally clear search on navigate
    } catch (error) {
      console.error("Failed to load directory:", error, targetPath);
    }
  };

  const goBack = () => {
    if (history.length === 0) return;
    const newHistory = [...history];
    const previousPath = newHistory.pop();
    setHistory(newHistory);
    loadDirectory(previousPath, false);
  };

  useEffect(() => {
    async function init() {
      const defaultPwd = await invoke("get_default_pwd");
      // await loadDirectory(defaultPwd);
      // const dir = await invoke("get_home_dir");
      // setBaseDir(dir);

      loadDirectory(props.defaultPath);
    }
    init();
  }, []);

  const handleFilterChange = (key) => {
    setFilters((prev) => {
      if (key === "all") {
        return {
          all: true,
          img: false,
          video: false,
          pdf: false,
          sheets: false,
          docs: false,
        };
      }

      const next = { ...prev, [key]: !prev[key] };
      const anyActive =
        next.img || next.video || next.pdf || next.sheets || next.docs;
      next.all = !anyActive;

      return next;
    });
  };

  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      // 1. search query
      if (
        searchQuery &&
        !f.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // 2. filters
      if (filters.all) return true;

      const ext = f.name.includes(".")
        ? f.name.split(".").pop().toLowerCase()
        : "";

      // img
      if (
        filters.img &&
        ["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext)
      )
        return true;

      // video
      if (filters.video && ["mp4", "mkv", "avi", "mov", "webm"].includes(ext))
        return true;

      // pdf
      if (filters.pdf && ext === "pdf") return true;

      // sheets
      if (filters.sheets && ["xls", "xlsx", "csv", "ods"].includes(ext))
        return true;

      // docs
      if (filters.docs && ["doc", "docx", "txt", "rtf", "odt"].includes(ext))
        return true;

      return false;
    });
  }, [files, searchQuery, filters]);

  const folderCount = filteredFiles.filter((f) => f.is_dir).length;
  const fileCount = filteredFiles.length - folderCount;

  function toggleView() {
    setView((prev) => (prev === "table" ? "grid" : "table"));
  }

  return (
    <div className="layout w-screen h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="header p-4 bg-white border-gray-100 border-solid border-2 shrink-0">
        <div className="flex flex-row justify-between flex-wrap gap-4">
          <div className="flex flex-row gap-2 flex-wrap items-center">
            <button
              onClick={goBack}
              disabled={history.length === 0}
              className="mr-2 flex items-center justify-center px-3 py-1.5 text-lg font-medium text-gray-700 bg-white border rounded shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-3 h-3 mr-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 8 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                />
              </svg>
              Back
            </button>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="hidden peer/img"
                checked={filters.all}
                onChange={() => handleFilterChange("all")}
              />
              <label
                htmlFor="all"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                All
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="img"
                className="hidden peer/img"
                checked={filters.img}
                onChange={() => handleFilterChange("img")}
              />
              <label
                htmlFor="img"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Images
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="video"
                className="hidden peer/img"
                checked={filters.video}
                onChange={() => handleFilterChange("video")}
              />
              <label
                htmlFor="video"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Videos
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="pdf"
                className="hidden peer/img"
                checked={filters.pdf}
                onChange={() => handleFilterChange("pdf")}
              />
              <label
                htmlFor="pdf"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                PDFs
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sheets"
                className="hidden peer/img"
                checked={filters.sheets}
                onChange={() => handleFilterChange("sheets")}
              />
              <label
                htmlFor="sheets"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Sheets
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="docs"
                className="hidden peer/img"
                checked={filters.docs}
                onChange={() => handleFilterChange("docs")}
              />
              <label
                htmlFor="docs"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Docs
              </label>
            </div>

            <input
              type="text"
              className="px-3 py-1.5 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
              placeholder="Search for files"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-2 flex-wrap items-center">
            <div className="flex items-center text-sm font-medium mr-2">
              Sort by date:
            </div>
            <div className="flex gap-2">
              <input
                type="radio"
                id="date-created"
                className="hidden peer/img"
                name="dateType"
                checked={sortOption === "date-created"}
                onChange={() => setSortOption("date-created")}
              />
              <label
                htmlFor="date-created"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Created
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="date-modified"
                className="hidden peer/img"
                name="dateType"
                checked={sortOption === "date-modified"}
                onChange={() => setSortOption("date-modified")}
              />
              <label
                htmlFor="date-modified"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Modified
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="radio"
                id="date-accessed"
                className="hidden peer/img"
                name="dateType"
                checked={sortOption === "date-accessed"}
                onChange={() => setSortOption("date-accessed")}
              />
              <label
                htmlFor="date-accessed"
                className="flex items-center justify-center px-3 py-1.5 text-lg rounded bg-gray-200 cursor-pointer peer-checked/img:bg-blue-500 peer-checked/img:text-white transition-colors"
              >
                Accessed
              </label>
            </div>

            <div className="flex justify-between align-middle gap-2">
              <svg
                onClick={toggleView}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`lucide lucide-rows3-icon lucide-rows-3 ${view === "table" ? "stroke-blue-500" : ""}`}
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M21 9H3" />
                <path d="M21 15H3" />
              </svg>

              <svg
                onClick={toggleView}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={`lucide lucide-layout-grid-icon lucide-layout-grid ${view === "grid" ? "stroke-blue-500" : ""}`}
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <aside className="bg-white overflow-y-auto shrink-0 flex flex-col p-4 shadow-sm z-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Bookmarks
        </h3>
        <nav className="flex flex-col gap-1">
          {bookmarks.map((b) => (
            <button
              key={b.name}
              onClick={() => loadDirectory(b.path)}
              className={`text-left px-3 py-2 text-lg rounded transition-colors ${
                path === b.path
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {b.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main flex-1 overflow-hidden flex flex-col bg-white">
        {view === "table" ? (
          <Table
            files={filteredFiles}
            sortOption={sortOption}
            onFolderDoubleClick={loadDirectory}
            addTab={props.addTab}
            loadDirectory={loadDirectory}
            updateTabPath={props.updateTabPath}
          />
        ) : (
          <Grid
            files={filteredFiles}
            sortOption={sortOption}
            onFolderDoubleClick={loadDirectory}
            addTab={props.addTab}
            loadDirectory={loadDirectory}
            updateTabPath={props.updateTabPath}
          />
        )}
      </main>
      <footer className="footer flex justify-between items-center px-4 py-2 bg-gray-100 border-t border-gray-200 text-sm font-medium text-gray-600">
        <h2>
          Current directory:{" "}
          <span className="font-semibold text-gray-800">{path}</span>
        </h2>
        <h2>
          {folderCount} Folders <span className="mx-2 opacity-50">|</span>{" "}
          {fileCount} Files
        </h2>
      </footer>
    </div>
  );
}
