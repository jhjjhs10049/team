import { Link } from "react-router-dom";
import { imageUrl } from "../../api/boardApi";

const BoardListComponent = ({ boards, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!boards || boards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">게시물이 없습니다.</div>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {boards.map((board) => (
        <div
          key={board.bno}
          className="bg-white p-4 rounded-lg shadow-md border"
        >
          <Link
            to={`/board/read/${board.bno}`}
            className="block hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                {board.title}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(board.regDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm text-gray-600">
                작성자: {board.writerEmail || `#${board.writerId}` || "익명"}
              </span>
              <span className="text-sm text-gray-500">
                조회: {board.viewCount || 0}
              </span>
              {board.replyCount > 0 && (
                <span className="text-sm text-blue-600">
                  댓글: {board.replyCount}
                </span>
              )}
            </div>

            <p className="text-gray-700 line-clamp-2">{board.content}</p>

            {board.images && board.images.length > 0 && (
              <div className="mt-2 flex gap-2">
                {board.images.slice(0, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={imageUrl(img.fileName)}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                ))}
                {board.images.length > 3 && (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-sm text-gray-600">
                    +{board.images.length - 3}
                  </div>
                )}
              </div>
            )}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BoardListComponent;
