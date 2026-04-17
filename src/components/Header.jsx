import React from "react";

export const Header = ({
  goBackHandler,
  historyLength,
  filters,
  handleFilterChange,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  toggleView,
  view
}) => {
  return (
    <header className="header p-4 bg-white border-gray-100 border-solid border-2 shrink-0">
      <div className="flex flex-row justify-between flex-wrap gap-4">
        <div className="flex flex-row gap-2 flex-wrap items-center">
          <button
            onClick={goBackHandler}
            disabled={historyLength === 0}
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
  );
};

