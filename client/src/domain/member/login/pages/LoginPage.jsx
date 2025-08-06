import BasicLayout from "../../../../layouts/BasicLayout";
import LoginComponent from "../components/LoginComponent";

const LoginPage = () => {
  return (
    <BasicLayout>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-md">
          <LoginComponent />
        </div>
      </div>
    </BasicLayout>
  );
};

export default LoginPage;
