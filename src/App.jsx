import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tab } from "./components/Tab";
import { getLastFolder } from "./utils";
import { addTab, setActiveTab, closeTab } from "./reduxStore/tabsSlice";

function App() {
  const dispatch = useDispatch();
  const tabGroups = useSelector((state) => state.tabs.tabGroups);

  const tabGroupElements = tabGroups.map((tabGroup, index) =>
    tabGroup.active ? <Tab key={index} index={index} /> : null,
  );

  function handleTabClick(index) {
    dispatch(setActiveTab(index));
  }

  function handleAddTab(e) {
    e.stopPropagation();
    dispatch(addTab("/home"));
  }

  function handleCloseTab(e, index) {
    e.stopPropagation();
    dispatch(closeTab(index));
  }

  const TabButtons = tabGroups.map((tabGroup, index) => (
    <button
      className={
        tabGroup.active
          ? "bg-blue-100 text-blue-800 font-bold px-4 py-2 flex justify-between items-center flex-1 cursor-pointer"
          : "bg-gray-50 px-4 py-2 flex justify-between items-center flex-1 cursor-pointer hover:bg-gray-100"
      }
      key={index}
      onClick={() => handleTabClick(index)}
    >
      <span className="truncate">{getLastFolder(tabGroup.path) || "Home"}</span>

      <svg
        onClick={(e) => handleCloseTab(e, index)}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-x-icon lucide-x fill-red-500 stroke-red-500 hover:opacity-75 ml-2"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  ));

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="px-2 flex justify-start align-middle w-full gap-1 border-b border-gray-200 shrink-0">
        {TabButtons}
        <button
          onClick={handleAddTab}
          className="px-4 py-2 bg-gray-100 hover:bg-blue-600 flex hover:text-white items-center justify-center font-bold text-gray-600"
        >
          +
        </button>
      </div>
      <div className="flex flex-1 w-full relative overflow-hidden">
        {tabGroupElements}
      </div>
    </div>
  );
}

export default App;
