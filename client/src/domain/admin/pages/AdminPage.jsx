import React from "react";
import BasicLayout from "../../../layouts/BasicLayout";
import AdminMemberManager from "../components/AdminMemberManager";
import useCustomLogin from "../../member/login/hooks/useCustomLogin";

const AdminPage = () => {
  const { loginState } = useCustomLogin();

  console.log("AdminPage 로그인 상태:", loginState); // 디버깅용

  // 관리자/매니저 권한 확인
  // loginState 구조에 따라 role 접근 방법을 조정
  const userRole = loginState?.role || loginState?.roleNames?.[0];

  if (
    !loginState ||
    !userRole ||
    (userRole !== "ADMIN" && userRole !== "MANAGER")
  ) {
    return (
      <BasicLayout>
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600">
                접근 권한이 없습니다
              </h2>
              <p className="mt-2 text-gray-600">
                관리자 또는 매니저 권한이 필요합니다.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                현재 권한: {userRole || "없음"}
              </p>
            </div>
          </div>
        </div>
      </BasicLayout>
    );
  }

  return (
    <BasicLayout>
      <div className="py-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
            <p className="mt-2 text-gray-600">
              {loginState.role === "ADMIN" ? "최고 관리자" : "매니저"} 권한으로
              로그인됨
            </p>
          </div>

          {/* 회원 관리 섹션 */}
          <div className="bg-white shadow rounded-lg">
            <AdminMemberManager />
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default AdminPage;
