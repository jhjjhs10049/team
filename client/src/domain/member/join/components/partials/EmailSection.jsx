import { checkEmail } from "../../../api/memberApi";

const EmailSection = ({ email, emailCheck, setEmailCheck, onChange }) => {
  // 이메일 중복확인 함수
  const handleEmailCheck = async () => {
    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailCheck({
        checked: true,
        available: false,
        message: "이메일을 입력해주세요.",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailCheck({
        checked: true,
        available: false,
        message: "올바른 이메일 형식을 입력해주세요.",
      });
      return;
    }

    try {
      const response = await checkEmail(email);

      if (response.exists) {
        setEmailCheck({
          checked: true,
          available: false,
          message: "이미 사용중인 이메일입니다.",
        });
      } else {
        setEmailCheck({
          checked: true,
          available: true,
          message: "사용 가능한 이메일입니다.",
        });
      }
    } catch (error) {
      console.error("이메일 중복확인 오류:", error);
      setEmailCheck({
        checked: true,
        available: false,
        message: "중복확인 중 오류가 발생했습니다.",
      });
    }
  };

  return (
    <div className="flex justify-center">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <div className="w-full p-3 text-left font-bold">Email</div>
        <div className="flex w-full gap-2 mb-2">
          <input
            className="flex-1 p-3 rounded border border-solid border-neutral-500 shadow-md"
            name="email"
            type="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={onChange}
          />
          <button
            type="button"
            className="px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
            onClick={handleEmailCheck}
            disabled={!email.trim()}
          >
            중복확인
          </button>
        </div>
        {emailCheck.checked && (
          <div
            className={`w-full text-sm px-3 py-1 ${
              emailCheck.available
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
            } rounded border ${
              emailCheck.available ? "border-green-200" : "border-red-200"
            }`}
          >
            {emailCheck.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailSection;
