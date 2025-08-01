const PasswordSection = ({ pw, pwConfirm, onChange }) => {
  return (
    <>
      {/* 비밀번호 입력 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pw"
            type="password"
            placeholder="비밀번호를 입력하세요 (6자리 이상)"
            value={pw}
            onChange={onChange}
          />
        </div>
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
          <div className="w-full p-3 text-left font-bold">Password Confirm</div>
          <input
            className="w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"
            name="pwConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={pwConfirm}
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
};

export default PasswordSection;
