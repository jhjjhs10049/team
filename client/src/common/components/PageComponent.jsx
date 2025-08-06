const PageComponent = ({ serverData, movePage }) => {
  return (
    <div className="m-6 flex justify-center">
      {/* 이전 페이지로 이동하는 버튼 */}{" "}
      {serverData.prev ? (
        <div
          className="m-2 p-2 w-16 text-center font-bold text-blue-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
          onClick={() => movePage({ page: serverData.prevPage })}
        >
          {" "}
          Prev{" "}
        </div>
      ) : (
        <></>
      )}
      {/* 페이지 번호들 */}{" "}
      {serverData.pageNumList.map((pageNum) => (
        <div
          key={pageNum}
          className={`m-2 p-2 w-12 text-center rounded shadow-md text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg
                    ${
                      serverData.current === pageNum
                        ? "bg-gray-500 hover:bg-gray-600"
                        : "bg-blue-400 hover:bg-blue-500"
                    }`}
          onClick={() => movePage({ page: pageNum })}
        >
          {pageNum}
        </div>
      ))}
      {/* 다음 페이지로 이동하는 버튼 */}{" "}
      {serverData.next ? (
        <div
          className="m-2 p-2 w-16 text-center font-bold text-blue-400 cursor-pointer hover:text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
          onClick={() => movePage({ page: serverData.nextPage })}
        >
          Next
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default PageComponent;
