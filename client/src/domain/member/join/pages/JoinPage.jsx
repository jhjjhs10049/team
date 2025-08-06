import BasicLayout from "../../../../layouts/BasicLayout";
import JoinComponent from "../components/JoinComponent";

const JoinPage = () => {
  return (
    <BasicLayout>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-md">
          <JoinComponent />
        </div>
      </div>
    </BasicLayout>
  );
};

export default JoinPage;
