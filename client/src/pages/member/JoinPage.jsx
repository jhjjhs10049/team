import BasicMenu from "../../components/menus/BasicMenu";
import JoinComponent from "../../components/member/JoinComponent";

const JoinPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <BasicMenu />

      <div className="flex-1 flex justify-center py-8">
        <div className="w-full max-w-md">
          <JoinComponent />
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
