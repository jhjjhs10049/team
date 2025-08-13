import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import memberRouter from "./memberRouter";
import { ProtectedComponent } from "../common/config/ProtectedLogin";
import { AdminManagerComponent } from "../common/config/ProtectedAdmin";

import MapGymsPage from "../domain/gyms/pages/MapGymsPage.jsx";
import GymDetailPage from "../domain/gyms/pages/GymDetailPage.jsx";
import GymReviewPage from "../domain/gyms/pages/GymReviewPage.jsx";

import TrainerListPage from "../domain/trainers/pages/TrainerListPage";
import TrainerDetailPage from "../domain/trainers/pages/TrainerDetailPage";
import TrainerReviewPage from "../domain/trainers/pages/TrainerReviewPage";

const Loading = <div>Loading....</div>;
// lazy()를 사용하여 컴포넌트를 동적으로 import
// 지연로딩 을 통해 초기 로딩 속도를 개선 필요한 시점에 컴포넌트 로드

const MainPage = lazy(() => import("../domain/main/pages/MainPage"));
const TestPage = lazy(() => import("../domain/test/pages/TestPage"));
const AdminPage = lazy(() => import("../domain/admin/pages/AdminPage"));

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
    path: "/admin/member",
    element: (
      <Suspense fallback={Loading}>
        <AdminManagerComponent redirectOnNoAuth={true}>
          <AdminPage />
        </AdminManagerComponent>
      </Suspense>
    ),
  },
  {
    path: "member",
    children: memberRouter(),
  },

  {
    path: "/mapgyms",
    element: (
      <Suspense fallback={Loading}>
        <MapGymsPage />
      </Suspense>
    ),
  },
  {
    path: "/gyms/:gymno",
    element: (
      <Suspense fallback={Loading}>
        <GymDetailPage />
      </Suspense>
    ),
  },
  {
    path: "/gyms/:gymno/reviews",
    element: (
      <Suspense fallback={Loading}>
        <GymReviewPage />
      </Suspense>
    ),
  },

  {
    path: "/trainers",
    element: (
      <Suspense fallback={Loading}>
        <TrainerListPage />
      </Suspense>
    ),
  },
  {
    path: "/trainers/:trainerno",
    element: (
      <Suspense fallback={Loading}>
        <TrainerDetailPage />
      </Suspense>
    ),
  },
  {
    path: "/trainers/:trainerno/reviews",
    element: (
      <Suspense fallback={Loading}>
        <TrainerReviewPage />
      </Suspense>
    ),
  },
]);

export default root;
