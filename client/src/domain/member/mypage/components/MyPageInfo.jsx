import React from "react";

const MyPageInfo = ({ memberData, onEditClick, onWithdrawClick }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* 회원번호 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">회원번호</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.memberNo}{" "}
          </div>
        </div>
      </div>

      {/* 이메일 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">이메일</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300 flex items-center justify-between">
            <span>{memberData.email}</span>
            {memberData.social && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                소셜 로그인
              </span>
            )}
          </div>
        </div>
      </div>
      {/* 닉네임 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">닉네임</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.nickname}
          </div>
        </div>
      </div>
      {/* 전화번호 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">전화번호</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.phone || "등록된 전화번호가 없습니다."}{" "}
          </div>
        </div>
      </div>

      {/* 우편번호 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">우편번호</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.postalCode || "등록된 우편번호가 없습니다."}
          </div>
        </div>
      </div>
      {/* 도로명주소 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">도로명주소</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.roadAddress || "등록된 도로명주소가 없습니다."}
          </div>
        </div>
      </div>
      {/* 상세주소 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">상세주소</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.detailAddress || "등록된 상세주소가 없습니다."}{" "}
          </div>
        </div>
      </div>

      {/* 가입일 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">가입일</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {formatDate(memberData.joinedDate)}{" "}
          </div>
        </div>
      </div>

      {/* 정보 수정 및 회원탈퇴 버튼 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={onEditClick}
        >
          정보 수정
        </button>
        {/* 소셜 로그인 사용자가 아닌 경우에만 회원탈퇴 버튼 표시 */}
        {!memberData.social && (
          <button
            className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            onClick={onWithdrawClick}
          >
            회원탈퇴
          </button>
        )}
      </div>
    </div>
  );
};

export default MyPageInfo;
