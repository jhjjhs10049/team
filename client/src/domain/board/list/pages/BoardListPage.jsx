import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicLayout from "../../../../layouts/BasicLayout";
import { listBoards } from "../../api/boardApi";
import BoardSearchComponent from "../components/BoardSearchComponent";
import BoardListComponent from "../components/BoardListComponent";
import BoardPaginationComponent from "../components/BoardPaginationComponent";
import { LoginRequiredButton } from "../../../../common/config/BoardProtectedAdmin";
import { BOARD_CONFIG, PAGE_UTILS } from "../../../../common/config/pageConfig";

export default function BoardListPage() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useState({
    keyword: "",
    type: "all",
  }); // 검색 파라미터를 객체로 관리
  const [page, setPage] = useState(BOARD_CONFIG.DEFAULT_PAGE);

  const [data, setData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
  });

  const [loading, setLoading] = useState(false);

  // 글쓰기 페이지로 이동
  const handleWriteClick = () => {
    navigate("/board/register");
  };

  useEffect(() => {
    let cancelled = false;
    const fetchList = async () => {
      try {
        setLoading(true);
        const validPage = PAGE_UTILS.validatePage(page, 0); // totalPages 의존성 제거
        const validSize = PAGE_UTILS.validateSize(
          BOARD_CONFIG.DEFAULT_SIZE,
          BOARD_CONFIG.MAX_SIZE
        );

        const res = await listBoards(searchParams, validPage, validSize);
        const normalized = {
          content: Array.isArray(res?.content) ? res.content : [],
          totalPages: typeof res?.totalPages === "number" ? res.totalPages : 0,
          number: typeof res?.number === "number" ? res.number : validPage,
        };
        if (!cancelled) setData(normalized);
      } catch (err) {
        console.error("목록 조회 실패:", err);
        if (!cancelled) setData({ content: [], totalPages: 0, number: 0 });
        alert("목록을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchList();
    return () => {
      cancelled = true;
    };
  }, [searchParams, page]); // searchParams로 변경

  const handleSearch = (searchData) => {
    setPage(BOARD_CONFIG.DEFAULT_PAGE); // 검색 시 첫 페이지로
    setSearchParams(searchData);
  };

  const handlePageChange = (newPage) => {
    const validPage = PAGE_UTILS.validatePage(newPage, data.totalPages);
    setPage(validPage);
  };

  const items = Array.isArray(data?.content) ? data.content : [];
  const totalPages = typeof data?.totalPages === "number" ? data.totalPages : 0;

  return (
    <BasicLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">게시판</h1>
          <LoginRequiredButton
            onClick={handleWriteClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            noAuthMessage="게시글 작성은 로그인이 필요합니다."
          >
            글쓰기
          </LoginRequiredButton>
        </div>
        <BoardSearchComponent onSearch={handleSearch} loading={loading} />
        <BoardListComponent boards={items} loading={loading} />
        <BoardPaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageConfig={BOARD_CONFIG}
        />
      </div>
    </BasicLayout>
  );
}
