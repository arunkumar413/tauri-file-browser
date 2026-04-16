export function Grid({ files }) {
  const sortedFiles = [...files].sort((a, b) => {
    if (a.is_dir === b.is_dir) return 0;
    return a.is_dir ? -1 : 1;
  });

  const filteredFileElements = sortedFiles.map((file, index) =>
    file.is_dir ? (
      <div
        key={index}
        className="flex flex-col justify-center items-center w-28"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-folder-icon lucide-folder stroke-gray-500"
        >
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
        </svg>
        <div className="text-center">{file.name}</div>
      </div>
    ) : (
      <div
        key={index}
        className="flex flex-col justify-start items-center mx-4 w-28"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="60"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-file-icon lucide-file stroke-gray-500"
        >
          <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
          <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        </svg>
        <div className="text-center">{file.name}</div>
      </div>
    ),
  );

  return (
    <div className="flex flex-wrap justify-start items-start gap-4">
      {filteredFileElements}
    </div>
  );
}
