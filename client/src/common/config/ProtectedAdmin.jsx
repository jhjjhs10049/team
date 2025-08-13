import React, { useEffect } from "react";
import useCustomLogin from "../../domain/member/login/hooks/useCustomLogin";
import alertManager from "../../domain/member/util/alertManager";

// 권한별 접근 제어를 위한 컴포넌트들

/**
 * ADMIN, MANAGER 권한이 필요한 일반 컴포넌트를 보호하는 Wrapper 컴포넌트
 * 권한이 없으면 컴포넌트 자체가 보이지 않음
 * URL 직접 접근 시에도 권한 체크하여 페이지/컴포넌트 전체를 보호
 *
 * 사용법:
 * <AdminManagerComponent
 *   noAuthMessage="로그인이 필요합니다."
 *   noPermissionMessage="관리자에게 문의하세요."
 *   fallback={<div>권한이 없습니다</div>}
 *   redirectOnNoAuth={true}
 * >
 *   <div>관리자만 볼 수 있는 내용</div>
 * </AdminManagerComponent>
 */
const AdminManagerComponent = ({
  children,
  fallback = null,
  hideOnNoAuth = true,
  showFallbackOnNoAuth = false,
  noAuthMessage = "로그인이 필요합니다.",
  noPermissionMessage = "관리자에게 문의하세요.",
    redirectOnNoAuth = false,
}) => {
  const { isLogin, loginState, moveToLogin, moveToPath } = useCustomLogin();

  useEffect(() => {
    if (redirectOnNoAuth) {
      // 로그인되지 않은 경우
      if (!isLogin) {
        alertManager.showAlert(noAuthMessage);
        moveToLogin();
        return;
      }

      // 권한 확인
      const userRole = loginState?.roleNames?.[0];
      if (userRole !== "ADMIN" && userRole !== "MANAGER") {
        alertManager.showAlert(noPermissionMessage);
        moveToPath("/"); // 메인화면으로 이동
        return;
      }
    }
  }, [
    isLogin,
    loginState,
    noAuthMessage,
    noPermissionMessage,
    moveToLogin,
    moveToPath,
    redirectOnNoAuth,
  ]);

  // 로그인되지 않은 경우
  if (!isLogin) {
    if (redirectOnNoAuth) return null; // 리다이렉트 진행 중
    if (hideOnNoAuth) return null;
    if (showFallbackOnNoAuth) return fallback;
    return null;
  }

  // 권한 확인
  const userRole = loginState?.roleNames?.[0];
  const hasPermission = userRole === "ADMIN" || userRole === "MANAGER";

  // 권한이 없는 경우
  if (!hasPermission) {
    if (redirectOnNoAuth) return null; // 리다이렉트 진행 중
    if (hideOnNoAuth) return null;
    if (showFallbackOnNoAuth) return fallback;
    return null;
  }

  // 권한이 있는 경우 children 렌더링
  return <>{children}</>;
};

/**
 * ADMIN, MANAGER 권한이 필요한 버튼을 보호하는 컴포넌트
 * 권한이 없으면 버튼 자체가 보이지 않음
 *
 * 사용법:
 * <AdminManagerButton
 *   onClick={handleClick}
 *   redirectMessage="관리자 권한이 필요합니다."
 *   noAuthMessage="로그인이 필요합니다."
 *   noPermissionMessage="관리자에게 문의하세요."
 * >
 *   관리자 기능
 * </AdminManagerButton>
 */
const AdminManagerButton = ({
  children,
  onClick,
  redirectMessage = "이 기능은 관리자 권한이 필요합니다.",
  noAuthMessage = "로그인이 필요합니다.",
  noPermissionMessage = "관리자에게 문의하세요.",
  className = "",
  disabled = false,
  hideOnNoAuth = true,
  showDisabled = false,
  redirectOnNoAuth = false,
  ...props
}) => {
  const { isLogin, loginState, moveToLogin, moveToPath } = useCustomLogin();

  useEffect(() => {
    if (redirectOnNoAuth) {
      // 로그인되지 않은 경우
      if (!isLogin) {
        alertManager.showAlert(noAuthMessage);
        moveToLogin();
        return;
      }

      // 권한 확인
      const userRole = loginState?.roleNames?.[0];
      if (userRole !== "ADMIN" && userRole !== "MANAGER") {
        alertManager.showAlert(noPermissionMessage);
        moveToPath("/"); // 메인화면으로 이동
        return;
      }
    }
  }, [
    isLogin,
    loginState,
    noAuthMessage,
    noPermissionMessage,
    moveToLogin,
    moveToPath,
    redirectOnNoAuth,
  ]);

  const handleClick = (e) => {
    if (!isLogin) {
      e.preventDefault();
      alertManager.showAlert(noAuthMessage);
      moveToLogin();
      return;
    }

    const userRole = loginState?.roleNames?.[0];
    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      e.preventDefault();
      alertManager.showAlert(redirectMessage);
      return;
    }

    // 권한이 있는 경우 원래 onClick 실행
    if (onClick) {
      onClick(e);
    }
  };

  // 로그인되지 않은 경우
  if (!isLogin) {
    if (redirectOnNoAuth) return null;
    if (hideOnNoAuth) return null;
    if (showDisabled) {
      return (
        <button
          {...props}
          className={`${className} opacity-50 cursor-not-allowed`}
          disabled={true}
          onClick={handleClick}
        >
          {children}
        </button>
      );
    }
    return null;
  }

  // 권한 확인
  const userRole = loginState?.roleNames?.[0];
  const hasPermission = userRole === "ADMIN" || userRole === "MANAGER";

  // 권한이 없는 경우
  if (!hasPermission) {
    if (redirectOnNoAuth) return null;
    if (hideOnNoAuth) return null;
    if (showDisabled) {
      return (
        <button
          {...props}
          className={`${className} opacity-50 cursor-not-allowed`}
          disabled={true}
          title="관리자 권한이 필요합니다"
        >
          {children}
        </button>
      );
    }
    return null;
  }

  // 권한이 있는 경우 정상 버튼 렌더링
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
 * ADMIN, MANAGER 권한이 필요한 링크를 보호하는 컴포넌트
 * 권한이 없으면 링크 자체가 보이지 않음
 *
 * 사용법:
 * <AdminManagerLink
 *   to="/admin"
 *   redirectMessage="관리자 권한이 필요합니다."
 *   noAuthMessage="로그인이 필요합니다."
 *   noPermissionMessage="관리자에게 문의하세요."
 * >
 *   관리자 페이지
 * </AdminManagerLink>
 */
const AdminManagerLink = ({
  children,
  to,
  redirectMessage = "이 페이지는 관리자 권한이 필요합니다.",
  noAuthMessage = "로그인이 필요합니다.",
  noPermissionMessage = "관리자에게 문의하세요.",
  className = "",
  hideOnNoAuth = true,
  redirectOnNoAuth = false,
  ...props
}) => {
  const { isLogin, loginState, moveToLogin, moveToPath } = useCustomLogin();

  useEffect(() => {
    if (redirectOnNoAuth) {
      // 로그인되지 않은 경우
      if (!isLogin) {
        alertManager.showAlert(noAuthMessage);
        moveToLogin();
        return;
      }

      // 권한 확인
      const userRole = loginState?.roleNames?.[0];
      if (userRole !== "ADMIN" && userRole !== "MANAGER") {
        alertManager.showAlert(noPermissionMessage);
        moveToPath("/"); // 메인화면으로 이동
        return;
      }
    }
  }, [
    isLogin,
    loginState,
    noAuthMessage,
    noPermissionMessage,
    moveToLogin,
    moveToPath,
    redirectOnNoAuth,
  ]);

  const handleClick = (e) => {
    e.preventDefault();

    if (!isLogin) {
      alertManager.showAlert(noAuthMessage);
      moveToLogin();
      return;
    }

    const userRole = loginState?.roleNames?.[0];
    if (userRole !== "ADMIN" && userRole !== "MANAGER") {
      alertManager.showAlert(redirectMessage);
      return;
    }

    // 권한이 있는 경우 해당 경로로 이동
    moveToPath(to);
  };

  // 로그인되지 않은 경우
  if (!isLogin) {
    if (redirectOnNoAuth) return null;
    if (hideOnNoAuth) return null;
    return null;
  }

  // 권한 확인
  const userRole = loginState?.roleNames?.[0];
  const hasPermission = userRole === "ADMIN" || userRole === "MANAGER";

  if (!hasPermission) {
    if (redirectOnNoAuth) return null;
    if (hideOnNoAuth) return null;
    return null;
  }

  return (
    <a {...props} href={to} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

// 컴포넌트들을 export
export { AdminManagerComponent, AdminManagerButton, AdminManagerLink };
