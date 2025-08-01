import BasicMenu from "../../components/menus/BasicMenu";
import LoginComponent from "../../components/member/LoginComponent";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BasicMenu />

      <div className="flex-1 flex justify-center py-8">
        <div className="w-full max-w-md">
          <LoginComponent />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
