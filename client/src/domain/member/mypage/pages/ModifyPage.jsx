import MyPageComponent from "../components/MyPageComponent";
import BasicLayout from "../../../../layouts/BasicLayout";

const ModifyPage = () => {
  return (
    <BasicLayout>
      <div className="text-3xl">Member Modify Page</div>{" "}
      <div className="bg-white w-full mt-4 p-2">
        <MyPageComponent></MyPageComponent>
      </div>
    </BasicLayout>
  );
};

export default ModifyPage;
