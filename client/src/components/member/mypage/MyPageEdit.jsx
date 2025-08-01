import React from "react";
import ProfileSection from "./ProfileSection";
import PasswordSection from "./PasswordSection";
import AddressSection from "../join/AddressSection";

const MyPageEdit = ({
  editData,
  memberData,
  nicknameCheck,
  setNicknameCheck,
  setEditData,
  onChange,
  onSave,
  onCancel,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      {/* 회원번호 (읽기 전용) */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">회원번호</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {memberData.memberNo}
          </div>
        </div>
      </div>

      {/* 프로필 정보 섹션 */}
      <ProfileSection
        editData={editData}
        memberData={memberData}
        nicknameCheck={nicknameCheck}
        setNicknameCheck={setNicknameCheck}
        onChange={onChange}
      />

      {/* 비밀번호 섹션 */}
      <PasswordSection editData={editData} onChange={onChange} />

      {/* 주소 섹션 */}
      <AddressSection
        postalCode={editData.postalCode}
        detailAddress={editData.detailAddress}
        setJoinParam={setEditData}
        joinParam={editData}
        onChange={onChange}
      />

      {/* 가입일 (읽기 전용) */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">가입일</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {new Date(memberData.joinedDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          onClick={onSave}
        >
          저장
        </button>
        <button
          className="px-6 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default MyPageEdit;
