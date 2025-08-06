import React from "react";
import { checkNickname } from "../../../api/memberApi";

const ProfileSection = ({
  editData,
  memberData,
  nicknameCheck,
  setNicknameCheck,
  onChange,
}) => {
  // 닉네임 중복확인 함수
  const handleNicknameCheck = async () => {
    if (!editData.nickname.trim()) {
      setNicknameCheck({
        checked: true,
        available: false,
        message: "닉네임을 입력해주세요.",
      });
      return;
    }

    if (editData.nickname.length < 2) {
      setNicknameCheck({
        checked: true,
        available: false,
        message: "닉네임은 2자 이상 입력해주세요.",
      });
      return;
    }

    // 현재 닉네임과 같다면 사용 가능
    if (editData.nickname === memberData.nickname) {
      setNicknameCheck({
        checked: true,
        available: true,
        message: "현재 사용중인 닉네임입니다.",
      });
      return;
    }

    try {
      const response = await checkNickname(editData.nickname);

      if (response.exists) {
        setNicknameCheck({
          checked: true,
          available: false,
          message: "이미 사용중인 닉네임입니다.",
        });
      } else {
        setNicknameCheck({
          checked: true,
          available: true,
          message: "사용 가능한 닉네임입니다.",
        });
      }
    } catch (error) {
      console.error("닉네임 중복확인 오류:", error);
      setNicknameCheck({
        checked: true,
        available: false,
        message: "중복확인 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <>
      {/* 이메일 (읽기 전용) */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">이메일</div>
          <div className="w-full p-3 bg-gray-100 rounded border border-gray-300">
            {editData.email}
          </div>
        </div>
      </div>

      {/* 닉네임 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">닉네임</div>
          <div className="flex w-full gap-2 mb-2">
            <input
              className="flex-1 p-3 rounded border border-solid border-neutral-500 shadow-md"
              name="nickname"
              type="text"
              placeholder="닉네임을 입력하세요 (2자 이상)"
              value={editData.nickname}
              onChange={onChange}
            />
            <button
              type="button"
              className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
              onClick={handleNicknameCheck}
              disabled={!editData.nickname.trim()}
            >
              중복확인
            </button>
          </div>
          {nicknameCheck.checked && (
            <div
              className={`w-full text-sm px-3 py-2 rounded ${
                nicknameCheck.available
                  ? "text-green-700 bg-green-100 border border-green-200"
                  : "text-red-700 bg-red-100 border border-red-200"
              }`}
            >
              {nicknameCheck.message}
            </div>
          )}
        </div>
      </div>

      {/* 전화번호 */}
      <div className="flex justify-center mb-4">
        <div className="relative flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">전화번호</div>
          <input
            className="w-full p-3 rounded border border-solid border-neutral-500 shadow-md"
            name="phone"
            type="tel"
            placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
            value={editData.phone}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
