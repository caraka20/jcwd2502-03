import Cookies from "js-cookie";
import { useEffect, useState } from "react";
// import "./protected.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/api";
import Logo from "../components/Logo/Logo";
export default function Protected({
  children,
  ownerPage,
  adminPage,
  customerPage,
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");
  console.log(user);
  const getUser = async () => {
    try {
      const data = await axiosInstance.get(
        `/auth/userdata/${Cookies.get("user_token")}`
      );
      setUser(data.data.result.role);
    } catch (error) {
      console.log(error);
    }
  };

  const nav = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    // getUser()


    if (user == "Owner" && customerPage === true)

      return (
        // setTimeout(() => {
        //   // setLoading(false);
        // }, 1000),
        nav("/admin/dashboard")
      );
    if (user === "Customer" && ownerPage)
      return (
        // setTimeout(() => {
        //   // setLoading(false);
        // }, 1000),
        nav("/")
      );
    if (user === "Warehouse Admin" && customerPage)
      return (
        // setTimeout(() => {
        //   setLoading(false);
        // }, 1000),
        nav("admin/dashboard")
      );

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [user, ownerPage, customerPage]);

  return (
    <>
      {loading ? (
        <>
          {" "}
          <div className="h-screen grid place-content-center">
            <div className="">
              <div className="grid place-content-center">
                {/* <Logo /> */}
              </div>
              <div className="grid place-content-center">
                <span className="loading loading-dots w-[50px] text-green-800"></span>
              </div>
            </div>
          </div>
        </>
      ) : (
        children
      )}
    </>
  );
}
