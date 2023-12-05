import toast from "react-hot-toast";
import axiosInstance from "../../config/api";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

const VerificationTab = ({ is_verified }) => {
  const emailButtonHandler = async () => {
    try {
      const loginToken = Cookies.get("user_token");

      const userData = await axiosInstance.get(`/auth/userdata/${loginToken}`);

      const res = await axiosInstance.post(
        `/auth/resend-verification-email/${userData.data.result.id}`
      );
      setTimeout(() => {
        toast.success(res.data.message);
      }, 1000);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className={`${is_verified === true ? "" : "mt-[100px] mb-[-100px]" }`}>
      <div
        className="flex flex-col text-black w-full h-[60px] justify-center border-2 bg-green-500"
        style={{ zIndex: 9999, position: "static" }}
      >
        <div className="flex justify-center text-red-700 font-bold">
          Your account has not been verified!
        </div>
        <div
          className="flex justify-center underline cursor-pointer"
          onClick={emailButtonHandler}
        >
          Resend verification email
        </div>
      </div>
    </div>
  );
};

export default VerificationTab;
