import { useState } from "react";

const BoardReplyComponent = ({
  replies,
  myEmail,
  isAdmin,
  onAddReply,
  onUpdateReply,
  onDeleteReply,
  loading,
}) => {
  const [replyText, setReplyText] = useState("");
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyText, setEditingReplyText] = useState("");

  const handleAddReply = async () => {
    if (!replyText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      await onAddReply(replyText);
      setReplyText("");
    } catch {
      alert("댓글 추가에 실패했습니다.");
    }
  };

  const handleUpdateReply = async (replyId) => {
    if (!editingReplyText.trim()) {
      alert("댓글 내용을 입력하세요.");
      return;
    }

    try {
      await onUpdateReply(replyId, editingReplyText);
      setEditingReplyId(null);
      setEditingReplyText("");
    } catch {
      alert("댓글 수정에 실패했습니다.");
    }
  };

  const startEditing = (reply) => {
    setEditingReplyId(reply.replyId);
    setEditingReplyText(reply.replyText);
  };

  const cancelEditing = () => {
    setEditingReplyId(null);
    setEditingReplyText("");
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">
        댓글 ({replies?.length || 0})
      </h3>
      {/* 댓글 작성 */}
      {myEmail && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleAddReply}
              disabled={loading || !replyText.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              댓글 작성
            </button>
          </div>
        </div>
      )}
      {/* 댓글 목록 */}{" "}
      <div className="space-y-4">
        {replies && replies.length > 0 ? (
          replies.map((reply) => (
            <div key={reply.id} className="p-4 bg-white border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">
                    {reply.writerEmail || `#${reply.writerId}` || "익명"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(reply.regDate).toLocaleString()}
                  </span>
                  {reply.modDate !== reply.regDate && (
                    <span className="text-xs text-gray-400">(수정됨)</span>
                  )}
                </div>

                {(myEmail === reply.writerEmail || isAdmin) && (
                  <div className="flex gap-2">
                    {editingReplyId === reply.id ? (
                      <>
                        <button
                          onClick={() => handleUpdateReply(reply.id)}
                          disabled={loading}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          저장
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(reply)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => onDeleteReply(reply.id)}
                          disabled={loading}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {editingReplyId === reply.id ? (
                <textarea
                  value={editingReplyText}
                  onChange={(e) => setEditingReplyText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">
                  {reply.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            첫 번째 댓글을 작성해보세요!
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardReplyComponent;
