import React, { useEffect } from "react";
import useCustomLogin from "../../domain/member/login/hooks/useCustomLogin";
import alertManager from "../../domain/member/util/alertManager";

// 게시글 권한별 접근 제어를 위한 컴포넌트들

/**
 * 게시글 작성자 또는 ADMIN, MANAGER 권한이 필요한 컴포넌트를 보호하는 Wrapper 컴포넌트
 * 권한이 없으면 컴포넌트 자체가 보이지 않음
 *
 * 사용법:
 * <AuthorOrAdminComponent
 *   authorEmail="작성자이메일"
 *   noAuthMessage="로그인이 필요합니다."
 *   noPermissionMessage="작성자 또는 관리자만 접근할 수 있습니다."
 *   fallback={<div>권한이 없습니다</div>}
 *   redirectOnNoAuth={false}
 * >
 *   <div>작성자 또는 관리자만 볼 수 있는 내용</div>
 * </AuthorOrAdminComponent>
 */
const AuthorOrAdminComponent = ({
  children,
  authorEmail,
  fallback = null,
  hideOnNoAuth = true,
  showFallbackOnNoAuth = false,
  noAuthMessage = "로그인이 필요합니다.",
  noPermissionMessage = "작성자 또는 관리자만 접근할 수 있습니다.",
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
      const userEmail = loginState?.email;
      const userRole = loginState?.roleNames?.[0];
      const isAuthor = userEmail === authorEmail;
      const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

      if (!isAuthor && !isAdminOrManager) {
        alertManager.showAlert(noPermissionMessage);
        moveToPath("/"); // 메인화면으로 이동
        return;
      }
    }
  }, [
    isLogin,
    loginState,
    authorEmail,
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
  const userEmail = loginState?.email;
  const userRole = loginState?.roleNames?.[0];
  const isAuthor = userEmail === authorEmail;
  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";
  const hasPermission = isAuthor || isAdminOrManager;

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
 * 게시글 작성자 또는 ADMIN, MANAGER 권한이 필요한 버튼을 보호하는 컴포넌트
 * 권한이 없으면 버튼 자체가 보이지 않음
 *
 * 사용법:
 * <AuthorOrAdminButton
 *   authorEmail="작성자이메일"
 *   onClick={handleClick}
 *   noAuthMessage="로그인이 필요합니다."
 *   noPermissionMessage="작성자 또는 관리자만 수정/삭제할 수 있습니다."
 * >
 *   수정/삭제
 * </AuthorOrAdminButton>
 */
const AuthorOrAdminButton = ({
  children,
  authorEmail,
  onClick,
  redirectMessage = "작성자 또는 관리자만 수정/삭제할 수 있습니다.",
  noAuthMessage = "로그인이 필요합니다.",
  noPermissionMessage = "작성자 또는 관리자만 수정/삭제할 수 있습니다.",
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
      const userEmail = loginState?.email;
      const userRole = loginState?.roleNames?.[0];
      const isAuthor = userEmail === authorEmail;
      const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

      if (!isAuthor && !isAdminOrManager) {
        alertManager.showAlert(noPermissionMessage);
        moveToPath("/"); // 메인화면으로 이동
        return;
      }
    }
  }, [
    isLogin,
    loginState,
    authorEmail,
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

    const userEmail = loginState?.email;
    const userRole = loginState?.roleNames?.[0];
    const isAuthor = userEmail === authorEmail;
    const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

    if (!isAuthor && !isAdminOrManager) {
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
  const userEmail = loginState?.email;
  const userRole = loginState?.roleNames?.[0];
  const isAuthor = userEmail === authorEmail;
  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";
  const hasPermission = isAuthor || isAdminOrManager;

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
          title="작성자 또는 관리자만 수정/삭제할 수 있습니다"
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
 * 게시글 작성자 또는 ADMIN, MANAGER 권한이 필요한 링크를 보호하는 컴포넌트
 * 권한이 없으면 링크 자체가 보이지 않음
 *
 * 사용법:
 * <AuthorOrAdminLink
 *   authorEmail="작성자이메일"
 *   to="/board/1/edit"
 *   noAuthMessage="로그인이 필요합니다."
 *   noPermissionMessage="작성자 또는 관리자만 수정할 수 있습니다."
 * >
 *   게시글 수정
 * </AuthorOrAdminLink>
 */
const AuthorOrAdminLink = ({
  children,
  authorEmail,
  to,
  redirectMessage = "작성자 또는 관리자만 접근할 수 있습니다.",
  noAuthMessage = "로그인이 필요합니다.",
  noPermissionMessage = "작성자 또는 관리자만 접근할 수 있습니다.",
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
      const userEmail = loginState?.email;
      const userRole = loginState?.roleNames?.[0];
      const isAuthor = userEmail === authorEmail;
      const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

      if (!isAuthor && !isAdminOrManager) {
        alertManager.showAlert(noPermissionMessage);
        moveToPath("/"); // 메인화면으로 이동
        return;
      }
    }
  }, [
    isLogin,
    loginState,
    authorEmail,
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

    const userEmail = loginState?.email;
    const userRole = loginState?.roleNames?.[0];
    const isAuthor = userEmail === authorEmail;
    const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";

    if (!isAuthor && !isAdminOrManager) {
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
  const userEmail = loginState?.email;
  const userRole = loginState?.roleNames?.[0];
  const isAuthor = userEmail === authorEmail;
  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";
  const hasPermission = isAuthor || isAdminOrManager;

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

/**
 * 로그인한 사용자만 사용할 수 있는 버튼 (게시글 작성 등)
 * 로그인하지 않은 경우 버튼이 보이지 않거나 로그인 페이지로 이동
 *
 * 사용법:
 * <LoginRequiredButton
 *   onClick={handleWrite}
 *   noAuthMessage="게시글 작성은 로그인이 필요합니다."
 * >
 *   게시글 작성
 * </LoginRequiredButton>
 */
const LoginRequiredButton = ({
  children,
  onClick,
  noAuthMessage = "로그인이 필요합니다.",
  className = "",
  disabled = false,
  hideOnNoAuth = true,
  showDisabled = false,
  ...props
}) => {
  const { isLogin, moveToLogin } = useCustomLogin();

  const handleClick = (e) => {
    if (!isLogin) {
      e.preventDefault();
      alertManager.showAlert(noAuthMessage);
      moveToLogin();
      return;
    }

    // 로그인한 경우 원래 onClick 실행
    if (onClick) {
      onClick(e);
    }
  };

  // 로그인되지 않은 경우
  if (!isLogin) {
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

  // 로그인한 경우 정상 버튼 렌더링
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

// 컴포넌트들을 export
export {
  AuthorOrAdminComponent,
  AuthorOrAdminButton,
  AuthorOrAdminLink,
  LoginRequiredButton,
};
