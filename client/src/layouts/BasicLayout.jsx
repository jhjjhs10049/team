import BasicMenu from "../common/menus/Header.jsx";
import Footer from "../common/menus/Footer.jsx";

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
