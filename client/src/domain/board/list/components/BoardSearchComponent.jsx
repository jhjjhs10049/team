import { useState } from "react";

const BoardSearchComponent = ({ onSearch, loading }) => {
  const [queryInput, setQueryInput] = useState("");

  const handleSearch = () => {
    onSearch(queryInput.trim());
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="mb-6 flex gap-2">
      <input
        type="text"
        value={queryInput}
        onChange={(e) => setQueryInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="검색어를 입력하세요"
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={loading}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
      >
        검색
      </button>
    </div>
  );
};

export default BoardSearchComponent;
