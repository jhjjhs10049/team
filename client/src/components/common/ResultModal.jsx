const ResultModal = ({ title, content, callbackFn }) => {
  return (
    // 콜백설명
    // 부모객체에서 result 값이 있으면 ResultModal 컴포넌트를 보여주고 없으면 안보여주게 되어있음
    // 부모객체에서 callbackFn={closeModal}으로 ResultModal 컴포넌트에서 callbackFn을 호출하면 closeModal 함수가 실행됨
    // closeModal 은 result 값을 초기화하여 ResultModal 컴포넌트가 사라지게

    // 모달창의 흐린 검은배경
    <div className={`fixed top-0 left-0 z-[1055] flex h-full w-full justify-center bg-black/30`}>

      <div className="absolute bg-white shadow dark:bg-gray-700 opacity-100 w-1/4 rounded mt-10 mb-10 px-6 min-w-[600px]">
        <div className="justify-center bg-warning-400 mt-6 text-2xl border-b-4 border-gray-500">
          {title}
        </div>
        <div className="text-4xl border-orange-400 border-b-4 pt-4 pb-4">
          {content}
        </div>
        <div className="justify-end flex">
          <button
            className="rounded bg-blue-500 mt-4 mb-4 px-6 pt-4 pb-4 text-lg text-white"
            onClick={() => {
              if (callbackFn) {
                callbackFn();
              }
            }}
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResultModal;
