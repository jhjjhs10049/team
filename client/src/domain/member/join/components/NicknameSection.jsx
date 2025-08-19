import { checkNickname } from "../../api/memberApi";

const NicknameSection = ({
  nickname,
  nicknameCheck,
  setNicknameCheck,
  onChange,
}) => {
  // 닉네임 중복확인 함수
  const handleNicknameCheck = async () => {
    if (!nickname.trim()) {
      setNicknameCheck({
        checked: true,
        available: false,
        message: "닉네임을 입력해주세요.",
      });
      return;
    }

    if (nickname.length < 2) {
      setNicknameCheck({
        checked: true,
        available: false,
        message: "닉네임은 2자 이상 입력해주세요.",
      });
      return;
    }

    try {
      const response = await checkNickname(nickname);

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
    <div className="flex justify-center">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <div className="w-full p-3 text-left font-bold">Nickname</div>
        <div className="flex w-full gap-2 mb-2">
          <input
            className="flex-1 p-3 rounded border border-solid border-neutral-500 shadow-md"
            name="nickname"
            type="text"
            placeholder="닉네임을 입력하세요 (2자 이상)"
            value={nickname}
            onChange={onChange}
          />
          <button
            type="button"
            className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
            onClick={handleNicknameCheck}
            disabled={!nickname.trim()}
          >
            중복확인
          </button>
        </div>
        {/* 중복확인 결과 메시지 */}
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
  );
};

export default NicknameSection;
