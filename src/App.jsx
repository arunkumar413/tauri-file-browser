import React, { useState } from "react";
import { Tab } from "./components/Tab";
import { getLastFolder } from "./utils";

function App() {
  const [tabGroups, setTabGroups] = useState([
    { path: "/home", active: true, history: [] },
  ]);

  function updateTabPath(index, path) {
    const newTabGroups = tabGroups.map((tabGroup, i) =>
      i === index ? { ...tabGroup, path } : tabGroup,
    );
    setTabGroups(newTabGroups);
  }

  function addToTabHistory(index, path) {
    const newTabGroups = tabGroups.map((tabGroup, i) =>
      i === index
        ? { ...tabGroup, history: [...tabGroup.history, path] }
        : tabGroup,
    );
    setTabGroups(newTabGroups);
  }

  const tabGroupElements = tabGroups.map((tabGroup, index) =>
    tabGroup.active ? (
      <Tab
        addTab={addTab}
        key={index}
        defaultPath={tabGroup.path}
        updateTabPath={updateTabPath}
      />
    ) : null,
  );

  function handleTabClick(index) {
    const newTabGroups = tabGroups.map((tabGroup, i) => ({
      ...tabGroup,
      active: i === index,
    }));
    setTabGroups(newTabGroups);
  }

  function addTab(dirPath) {
    const newTabGroups = [...tabGroups, { path: dirPath, active: false }];
    setTabGroups(newTabGroups);
  }

  const TabButtons = tabGroups.map((tabGroup, index) => (
    <button
      className={
        tabGroup.active
          ? "bg-blue-200 px-4 py-2 flex justify-between align-middle flex-1"
          : "bg-gray-200 px-4 py-2 flex justify-between align-middle flex-1"
      }
      key={index}
      onClick={() => handleTabClick(index)}
    >
      {/* {tabGroup.path}*/}

      {getLastFolder(tabGroup.path)}

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-x-icon lucide-x fill-red-500 stroke-red-500 hover-red-200"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  ));

  return (
    <div className="">
      <div className="flex justify-flex-start align-middle w-full gap-1">
        {TabButtons}
      </div>
      {tabGroupElements}
    </div>
  );
}

export default App;
