import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import memberRouter from "./memberRouter";
import { ProtectedComponent } from "../common/config/ProtectedLogin";
import { AdminManagerComponent } from "../common/config/ProtectedAdmin";

const Loading = <div>Loading....</div>;
// lazy()를 사용하여 컴포넌트를 동적으로 import
// 지연로딩 을 통해 초기 로딩 속도를 개선 필요한 시점에 컴포넌트 로드

const MainPage = lazy(() => import("../domain/main/pages/MainPage"));
const TestPage = lazy(() => import("../domain/test/pages/TestPage"));
const AdminTestPage = lazy(() => import("../domain/test/pages/AdminTestPage"));

const root = createBrowserRouter([
  {
    // (루트 경로) → MainPage 컴포넌트를 렌더링
    path: "",
    element: (
      <Suspense fallback={Loading}>
        <MainPage />
      </Suspense>
    ),
  },
  {
    // 테스트 페이지 렌더링 (로그인 필요)
    path: "/test",
    element: (
      <Suspense fallback={Loading}>
        <ProtectedComponent>
          <TestPage />
        </ProtectedComponent>
      </Suspense>
    ),
  },
  {
    // 어드민 테스트 페이지 렌더링 (어드민 필요)
    path: "/admin-test",
    element: (
      <Suspense fallback={Loading}>
        <AdminManagerComponent>
          <AdminTestPage />
        </AdminManagerComponent>
      </Suspense>
    ),
  },
  {
    path: "member",
    children: memberRouter(),
  },
]);

export default root;
