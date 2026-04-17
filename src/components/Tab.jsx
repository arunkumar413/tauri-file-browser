import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { invoke } from "@tauri-apps/api/core";
import { Table } from "./Table";
import "../App.css";
import { DEFAULT_FILTERS } from "../constants";
import { Grid } from "./Grid";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import {
  updateTabPath,
  goBack,
  addTab as reduxAddTab,
} from "../reduxStore/tabsSlice";

export function Tab({ index }) {
  const dispatch = useDispatch();
  const tabState = useSelector((state) => state.tabs.tabGroups[index]);
  const path = tabState ? tabState.path : "";
  const history = tabState ? tabState.history : [];

  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date-modified");
  const [view, setView] = useState("table");

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const loadDirectory = (targetPath, addToHistory = true) => {
    if (path !== targetPath) {
      dispatch(updateTabPath({ index, path: targetPath, addToHistory }));
    }
  };

  const goBackHandler = () => {
    dispatch(goBack(index));
  };

  const handleAddTab = (dirPath) => {
    dispatch(reduxAddTab(dirPath));
  };

  useEffect(() => {
    async function init() {
      if (!path) return;
      try {
        const resFiles = await invoke("read_dir", { path });
        setFiles(resFiles);
        setSearchQuery("");
      } catch (error) {
        console.error("Failed to load directory:", error, path);
      }
    }
    init();
  }, [path]);

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

  function handleTerminalIconClick(path) {
    invoke("open_terminal", { path });
  }

  return (
    <div className="layout w-full h-full bg-gray-50 text-gray-800">
      <Header
        goBackHandler={goBackHandler}
        historyLength={history.length}
        filters={filters}
        handleFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
        toggleView={toggleView}
        view={view}
      />

      <Sidebar />

      <main className="main overflow-auto flex flex-col bg-white">
        {view === "table" ? (
          <Table
            files={filteredFiles}
            sortOption={sortOption}
            onFolderDoubleClick={loadDirectory}
            addTab={handleAddTab}
            loadDirectory={loadDirectory}
          />
        ) : (
          <Grid
            files={filteredFiles}
            sortOption={sortOption}
            onFolderDoubleClick={loadDirectory}
            addTab={handleAddTab}
            loadDirectory={loadDirectory}
          />
        )}
      </main>

      <footer className="footer flex justify-between items-center px-4 py-2 bg-gray-100 border-t border-gray-200 text-sm font-medium text-gray-600">
        <div className="flex justify-start align-middle gap-2">
          <span className="text-gray-800">
            Current directory: <span className="font-bold"> {path} </span>
          </span>
          <svg
            onClick={() => handleTerminalIconClick(path)}
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#1f1f1f"
          >
            <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H160v400Zm140-40-56-56 103-104-104-104 57-56 160 160-160 160Zm180 0v-80h240v80H480Z" />
          </svg>
        </div>
        <div>
          {folderCount} Folders <span className="mx-2 opacity-50">|</span>{" "}
          {fileCount} Files
        </div>
      </footer>
    </div>
  );
}
