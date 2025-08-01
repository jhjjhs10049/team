import BasicMenu from "../components/menus/BasicMenu.jsx";
import Footer from "../components/menus/Footer.jsx";

const BasicLayout = ({ children }) => {
  return (
    <>
      <BasicMenu />{" "}
      <div className="bg-white my-5 w-full flex flex-col ">
        <main className="min-h-screen">{children}</main>
      </div>
      <Footer />
    </>
  );
};
export default BasicLayout;
