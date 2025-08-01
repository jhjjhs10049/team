import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import memberRouter from "./memberRouter";

const Loading = <div>Loading....</div>;
// lazy()를 사용하여 컴포넌트를 동적으로 import
// 지연로딩 을 통해 초기 로딩 속도를 개선 필요한 시점에 컴포넌트 로드

const MainPage = lazy(() => import("../pages/MainPage"));

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
    path: "member",
    children: memberRouter(),
  },
]);

export default root;
