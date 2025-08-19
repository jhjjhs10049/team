import React, { useState, useEffect, useCallback } from "react";
import { getAllMembers } from "../api/adminMemberApi";
import MemberActionModal from "./MemberActionModal";
import BanHistoryModal from "./BanHistoryModal";
import PageComponent from "../../../common/components/PageComponent";
import useCustomLogin from "../../member/login/hooks/useCustomLogin";

const AdminMemberManager = () => {
  const { loginState } = useCustomLogin();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 페이징 설정 (25개씩)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25);

  // 모달 상태
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    member: null,
    action: null,
  });

  const [banHistoryModal, setBanHistoryModal] = useState({
    isOpen: false,
    memberNo: null,
  }); // 회원 목록 조회
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // loginState 구조에 따라 role 접근 방법을 조정
      const userRole = loginState?.role || loginState?.roleNames?.[0];
      console.log("API 호출 시 사용할 권한:", userRole);

      const data = await getAllMembers(userRole);

      // API에서 이미 배열을 반환하도록 처리했으므로 간단히 확인
      if (Array.isArray(data)) {
        setMembers(data);
        console.log("회원 목록 조회 성공:", data.length, "건");
      } else {
        console.error("예상하지 못한 API 응답:", data);
        setMembers([]);
        setError("회원 목록 데이터 형식이 올바르지 않습니다.");
      }
    } catch (err) {
      setError(err.message || "회원 목록을 불러오는데 실패했습니다.");
      console.error("회원 목록 조회 오류:", err);
      setMembers([]); // 오류 시 빈 배열로 설정
    } finally {
      setLoading(false);
    }
  }, [loginState]);
  useEffect(() => {
    console.log("=== AdminMemberManager 초기화 ===");
    console.log("현재 로그인 상태:", loginState);

    // loginState 구조에 따라 role 접근 방법을 조정
    const userRole = loginState?.role || loginState?.roleNames?.[0];
    console.log("사용자 권한:", userRole);
    console.log("이메일:", loginState?.email);

    if (!loginState) {
      console.log("로그인 상태가 없습니다.");
      setMembers([]);
      setError("로그인이 필요합니다.");
      return;
    }

    if (!userRole) {
      console.log("사용자 권한을 찾을 수 없습니다.");
      setMembers([]);
      setError("사용자 권한을 확인할 수 없습니다.");
      return;
    }

    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      console.log("관리자 권한이 없습니다:", userRole);
      setMembers([]);
      setError("관리자 권한이 필요합니다.");
      return;
    }

    console.log("권한 확인됨, 회원 목록 조회 시작");
    fetchMembers();
  }, [loginState, fetchMembers]);
  // 현재 페이지의 회원 데이터
  const getCurrentPageData = () => {
    // members가 배열인지 확인
    if (!Array.isArray(members)) {
      console.error("members가 배열이 아닙니다:", members);
      return [];
    }
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return members.slice(startIndex, endIndex);
  };

  // 전체 페이지 수
  const totalPages = Math.ceil(
    (Array.isArray(members) ? members.length : 0) / pageSize
  );

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 셀 클릭 핸들러
  const handleCellClick = (member, field) => {
    if (field === "active") {
      // ACTIVE 상태에 따른 모달 열기
      let action;
      switch (member.active) {
        case "ACTIVE":
          action = "ban";
          break;
        case "BANNED":
          action = "unban";
          break;
        case "DELETED":
          action = "restore";
          break;
        default:
          return;
      }

      setActionModal({
        isOpen: true,
        member: member,
        action: action,
      });
    } else if (field === "role" && loginState.role === "ADMIN") {
      // 관리자만 권한 변경 가능
      setActionModal({
        isOpen: true,
        member: member,
        action: "changeRole",
      });
    } else if (field === "banHistory") {
      // 정지 내역 확인
      setBanHistoryModal({
        isOpen: true,
        memberNo: member.memberNo,
      });
    }
  };

  // 모달 닫기
  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      member: null,
      action: null,
    });
  };

  const closeBanHistoryModal = () => {
    setBanHistoryModal({
      isOpen: false,
      memberNo: null,
    });
  };

  // 액션 완료 후 목록 새로고침
  const handleActionComplete = () => {
    fetchMembers();
    closeActionModal();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const currentPageData = getCurrentPageData();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">회원 관리</h2>{" "}
        <p className="text-gray-600">
          총 {Array.isArray(members) ? members.length : 0}명의 회원 | 페이지당{" "}
          {pageSize}개 표시
        </p>
      </div>
      {/* 회원 테이블 */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                회원번호
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                닉네임
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                전화번호
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가입일
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                권한
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소셜
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                정지 내역
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPageData.map((member) => (
              <tr key={member.memberNo} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.memberNo}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.email}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.nickname}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.phone || "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(member.joinedDate).toLocaleDateString()}
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap text-sm cursor-pointer"
                  onClick={() => handleCellClick(member, "active")}
                >
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.active === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : member.active === "BANNED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {member.active === "ACTIVE" && "활성"}
                    {member.active === "BANNED" && "정지"}
                    {member.active === "DELETED" && "삭제"}
                  </span>
                </td>
                <td
                  className={`px-4 py-4 whitespace-nowrap text-sm ${
                    loginState.role === "ADMIN"
                      ? "cursor-pointer text-blue-600 hover:text-blue-800"
                      : "text-gray-900"
                  }`}
                  onClick={() =>
                    loginState.role === "ADMIN" &&
                    handleCellClick(member, "role")
                  }
                >
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      member.role === "USER"
                        ? "bg-blue-100 text-blue-800"
                        : member.role === "MANAGER"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {member.role}
                    {member.roleCode && ` (${member.roleCode})`}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {member.social ? "O" : "X"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleCellClick(member, "banHistory")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    내역 확인
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="mt-6">
          <PageComponent
            serverData={{
              dtoList: currentPageData,
              pageNumList: Array.from({ length: totalPages }, (_, i) => i + 1),
              pageRequestDTO: {
                page: currentPage,
                size: pageSize,
              },
              prev: currentPage > 1,
              next: currentPage < totalPages,
              totalCount: members.length,
              prevPage: currentPage > 1 ? currentPage - 1 : 1,
              nextPage: currentPage < totalPages ? currentPage + 1 : totalPages,
              totalPage: totalPages,
              current: currentPage,
            }}
            movePage={handlePageChange}
          />
        </div>
      )}{" "}
      {/* 액션 모달 */}
      {actionModal.isOpen && (
        <MemberActionModal
          member={actionModal.member}
          action={actionModal.action}
          onClose={closeActionModal}
          onComplete={handleActionComplete}
        />
      )}
      {/* 정지 내역 모달 */}
      {banHistoryModal.isOpen && (
        <BanHistoryModal
          memberNo={banHistoryModal.memberNo}
          onClose={closeBanHistoryModal}
        />
      )}
    </div>
  );
};

export default AdminMemberManager;
