import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTabPath } from '../reduxStore/tabsSlice';
import { invoke } from "@tauri-apps/api/core";


export function Sidebar() {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.tabs.tabGroups);

  // Find active tab and its index
  const activeTabIndex = tabs.findIndex(tab => tab.active);
  const activeTab = tabs[activeTabIndex];
  const activePath = activeTab ? activeTab.path : null;
  const [baseDir, setBaseDir] = useState("");

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

  const handleBookmarkClick = (path) => {
    if (activeTabIndex !== -1) {
      dispatch(updateTabPath({ index: activeTabIndex, path }));
    }
  };

  useEffect(function () {

    invoke('get_home_dir').then((res) => {
      setBaseDir(res);
    }).catch((err) => {
      console.log(err);
    })

  }, [])

  return (
    <aside className="sidebar bg-white overflow-y-auto shrink-0 flex flex-col p-4 shadow-sm z-10 border-r border-gray-200">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        Favourites
      </h3>
      <nav className="flex flex-col gap-1">
        {bookmarks.map((b) => (
          <button
            key={b.name}
            onClick={() => handleBookmarkClick(b.path)}
            className={`text-left px-3 py-2 text-lg rounded transition-colors ${activePath === b.path
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {b.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}
