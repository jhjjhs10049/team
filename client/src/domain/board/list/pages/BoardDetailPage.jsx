import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import BasicLayout from "../../../../layouts/BasicLayout";
import {
  getBoardDetail,
  deleteBoard,
  imageUrl,
  getReplies,
  addReply,
  updateReply,
  deleteReply,
} from "../../api/boardApi";
import BoardReplyPaginationComponent from "../components/BoardReplyPaginationComponent";
import { REPLY_CONFIG } from "../../../../common/config/pageConfig";
import {
  AuthorOrAdminButton,
  AuthorOnlyLink,
} from "../../../../common/config/BoardProtectedAdmin";

export default function BoardDetail() {
  const { bno } = useParams();
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.loginSlice);
  // 디버깅: 로그인 상태 확인
  console.log("=== BoardDetailPage 로그인 상태 ===");
  console.log("loginState:", loginState);
  console.log("loginState.email:", loginState?.email);
  console.log("loginState.memberNo:", loginState?.memberNo);

  const myEmail = loginState?.email || null;
  const myMemberNo = loginState?.memberNo || null;
  const isAdmin = Array.isArray(loginState?.roleNames)
    ? loginState.roleNames.includes("ADMIN") ||
      loginState.roleNames.includes("MANAGER")
    : loginState?.role === "ADMIN" || loginState?.role === "MANAGER";
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // 댓글 페이징 상태
  const [replyData, setReplyData] = useState(null);
  const [currentReplyPage, setCurrentReplyPage] = useState(
    REPLY_CONFIG.DEFAULT_PAGE
  );
  const [replyLoading, setReplyLoading] = useState(false);
  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getBoardDetail(bno);
      setDetail(data);
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      alert("게시글을 불러올 수 없습니다.");
      navigate("/board");
    } finally {
      setLoading(false);
    }
  }, [bno, navigate]);

  // 댓글 로딩 함수
  const loadReplies = useCallback(
    async (page = currentReplyPage) => {
      try {
        setReplyLoading(true);
        const data = await getReplies(bno, page, REPLY_CONFIG.DEFAULT_SIZE);
        setReplyData(data);
      } catch (error) {
        console.error("댓글 로딩 실패:", error);
      } finally {
        setReplyLoading(false);
      }
    },
    [bno, currentReplyPage]
  );
  useEffect(() => {
    loadDetail();
    loadReplies();
  }, [loadDetail, loadReplies]);

  const handleDeleteBoard = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteBoard(bno);
      alert("삭제되었습니다.");
      navigate("/board");
    } catch (error) {
      console.error("삭제 실패:", error);

      // JWT 토큰 관련 에러인 경우
      if (
        error.response?.status === 401 ||
        error.message?.includes("Authorization")
      ) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/member/login");
        return;
      }

      // 권한 부족인 경우
      if (error.response?.status === 403) {
        alert("삭제 권한이 없습니다.");
        return;
      }

      alert("삭제에 실패했습니다.");
    }
  };
  // 댓글 관련 핸들러
  const handleAddReply = async (replyText) => {
    try {
      await addReply(bno, replyText);
      await loadReplies(0); // 첫 페이지로 이동
      setCurrentReplyPage(0);
    } catch (error) {
      console.error("댓글 작성 실패:", error);

      // JWT 토큰 관련 에러인 경우
      if (
        error.response?.status === 401 ||
        error.message?.includes("Authorization") ||
        error.response?.data?.error === "REQUIRE_LOGIN"
      ) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/member/login");
        return;
      }

      // 권한 부족인 경우
      if (error.response?.status === 403) {
        alert("댓글 작성 권한이 없습니다.");
        return;
      }

      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleUpdateReply = async (replyId, replyText) => {
    try {
      await updateReply(bno, replyId, replyText);
      await loadReplies(); // 현재 페이지 유지
    } catch (error) {
      console.error("댓글 수정 실패:", error);

      // JWT 토큰 관련 에러인 경우
      if (
        error.response?.status === 401 ||
        error.message?.includes("Authorization") ||
        error.response?.data?.error === "REQUIRE_LOGIN"
      ) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/member/login");
        return;
      }

      // 권한 부족인 경우
      if (error.response?.status === 403) {
        alert("댓글 수정 권한이 없습니다.");
        return;
      }

      alert("댓글 수정에 실패했습니다.");
    }
  };
  const handleDeleteReply = async (replyId) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteReply(bno, replyId);
      await loadReplies(); // 현재 페이지 유지
    } catch (error) {
      console.error("댓글 삭제 실패:", error);

      // JWT 토큰 관련 에러인 경우
      if (
        error.response?.status === 401 ||
        error.message?.includes("Authorization") ||
        error.response?.data?.error === "REQUIRE_LOGIN"
      ) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        navigate("/member/login");
        return;
      }

      // 권한 부족인 경우
      if (error.response?.status === 403) {
        alert("댓글 삭제 권한이 없습니다.");
        return;
      }

      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleReplyPageChange = async (page) => {
    setCurrentReplyPage(page);
    await loadReplies(page);
  };

  if (loading) {
    return (
      <BasicLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">로딩 중...</div>
        </div>
      </BasicLayout>
    );
  }

  if (!detail) {
    return (
      <BasicLayout>
        <div className="text-center py-8">
          <div className="text-gray-500">게시글을 찾을 수 없습니다.</div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="max-w-4xl mx-auto p-6">
        {/* 게시글 헤더 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {" "}
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{detail.title}</h1>{" "}
            <div className="flex gap-2">
              <AuthorOnlyLink
                authorEmail={detail.writerEmail}
                to={`/board/modify/${detail.bno}`}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                noAuthMessage="게시글 수정은 로그인이 필요합니다."
                noPermissionMessage="작성자만 수정할 수 있습니다."
              >
                수정
              </AuthorOnlyLink>
              <AuthorOrAdminButton
                authorEmail={detail.writerEmail}
                onClick={handleDeleteBoard}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                noAuthMessage="게시글 삭제는 로그인이 필요합니다."
                noPermissionMessage="작성자 또는 관리자만 삭제할 수 있습니다."
              >
                삭제
              </AuthorOrAdminButton>
            </div>
          </div>
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span>
              작성자: {detail.writerEmail || `#${detail.writerId}` || "익명"}
            </span>
            <span>작성일: {new Date(detail.regDate).toLocaleString()}</span>
            {detail.modDate !== detail.regDate && (
              <span>수정일: {new Date(detail.modDate).toLocaleString()}</span>
            )}
          </div>
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 whitespace-pre-wrap">
              {detail.content}
            </p>
          </div>
          {/* 이미지 */}
          {detail.images && detail.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {detail.images.map((img, idx) => (
                <img
                  key={idx}
                  src={imageUrl(img.fileName)}
                  alt=""
                  className="w-full h-48 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>{" "}
        {/* 댓글 */}{" "}
        <BoardReplyPaginationComponent
          replyData={replyData}
          currentPage={currentReplyPage}
          myEmail={myEmail}
          myMemberNo={myMemberNo}
          isAdmin={isAdmin}
          onAddReply={handleAddReply}
          onUpdateReply={handleUpdateReply}
          onDeleteReply={handleDeleteReply}
          onPageChange={handleReplyPageChange}
          loading={replyLoading}
        />
        {/* 하단 버튼 */}
        <div className="flex justify-center mt-8">
          <Link
            to="/board"
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            목록으로
          </Link>
        </div>
      </div>
    </BasicLayout>
  );
}
