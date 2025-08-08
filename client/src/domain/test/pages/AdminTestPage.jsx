import BasicLayout from "../../../layouts/BasicLayout";

const MainPage = () => {
  return (
    <BasicLayout>
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-black-600 font-semibold tracking-wide uppercase">
              어드민 테스트 페이지
            </h2>
          </div>
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
