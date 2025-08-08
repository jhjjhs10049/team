import { useEffect } from "react";
import useCustomLogin from "../../domain/member/login/hooks/useCustomLogin";

// 로그인을 해야 사용할수 있는 기능들에 대한 변수들을 정리함

/**
 * 로그인이 필요한 컴포넌틀을 보호하는 컴포넌트
 *
 * 사용법:
 * <ProtectedComponent redirectMessage="이 기능은 로그인이 필요합니다.">
 *   <컴포넌트>
 * </ProtectedComponent>
 */
const ProtectedComponent = ({
  children,
  redirectMessage = "이 기능을 사용하시려면 로그인이 필요합니다.",
}) => {
  const { isLogin, moveToLogin } = useCustomLogin();

  useEffect(() => {
    if (!isLogin) {
      alert(redirectMessage);
      moveToLogin();
    }
  }, [isLogin, moveToLogin, redirectMessage]);

  // 로그인되지 않은 경우 null 반환 (리다이렉트 진행 중)
  if (!isLogin) {
    return null;
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return children;
};

/**
 * 로그인이 필요한 버튼을 보호하는 컴포넌트
 *
 * 사용법:
 * <ProtectedButton onClick={handleClick} redirectMessage="이 기능은 로그인이 필요합니다.">
 *   버튼 텍스트
 * </ProtectedButton>
 */
const ProtectedButton = ({
  children,
  onClick,
  redirectMessage = "이 기능을 사용하시려면 로그인이 필요합니다.",
  className = "",
  disabled = false,
  ...props
}) => {
  const { isLogin, moveToLogin } = useCustomLogin();

  const handleClick = (e) => {
    if (!isLogin) {
      e.preventDefault();
      alert(redirectMessage);
      moveToLogin();
      return;
    }

    // 로그인된 경우 원래 onClick 실행
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

/**
 * 링크 클릭을 보호하는 컴포넌트
 *
 * 사용법:
 * <ProtectedLink to="/mypage" redirectMessage="마이페이지는 로그인이 필요합니다.">
 *   마이페이지
 * </ProtectedLink>
 */
const ProtectedLink = ({
  children,
  to,
  redirectMessage = "이 페이지는 로그인이 필요합니다.",
  className = "",
  ...props
}) => {
  const { isLogin, moveToLogin, moveToPath } = useCustomLogin();

  const handleClick = (e) => {
    e.preventDefault();

    if (!isLogin) {
      alert(redirectMessage);
      moveToLogin();
      return;
    }

    // 로그인된 경우 해당 경로로 이동
    moveToPath(to);
  };

  return (
    <a {...props} href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

// 컴포넌트들을 export
export { ProtectedComponent, ProtectedButton, ProtectedLink };
