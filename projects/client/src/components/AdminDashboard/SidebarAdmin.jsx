import React from "react";
import { GoStack } from "react-icons/go";
import { FaUsers, FaExchangeAlt } from "react-icons/fa";
import { SlEarphones } from "react-icons/sl";
import { TbReport, TbHistory } from "react-icons/tb";
import { LuWarehouse } from "react-icons/lu";
import { GoSignOut } from "react-icons/go";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { MdOutlineLibraryBooks } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/Features/auth";
import Cookies from "js-cookie";

const SidebarAdmin = ({ tabValue, setTabValue, currentPath }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutButtonHandler = () => {
        Cookies.remove("user_token");
        dispatch(logout());
        navigate("/login");
    };

    const { role } = useSelector((state) => state.user);
    
    return (
        <>
            <div className="left-admin w-[264px] h-full border-[1px]  shadow-2xl rounded-[4px] py-[16px]">
                {/* <Link to={"/admin/dashboard"}>
                    <div
                        onClick={() => {
                            setTabValue(1);
                        }}
                        className={`flex  items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            currentPath === "/admin/dashboard"
                                ? "bg-primaryOrange  text-white"
                                : ""
                        }`}
                    >
                        <GoStack className="text-[18px]" />
                        <h1 className="text-[14px] ">Dashboard</h1>
                    </div>
                </Link> */}
                {role === "Owner" && (
                    <Link to={"/admin/users"}>
                        <div
                            onClick={() => setTabValue(2)}
                            className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                                currentPath === "/admin/users"
                                    ? "bg-primaryOrange  text-white"
                                    : ""
                            }`}
                        >
                            <FaUsers className="text-[18px]" />
                            <h1 className="text-[14px] ">Users</h1>
                        </div>
                    </Link>
                )}
                {role === "Owner" && (
                    <Link to={"/admin/warehouses"}>
                        <div
                            onClick={() => setTabValue(3)}
                            className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                                currentPath === "/admin/warehouses"
                                    ? "bg-primaryOrange  text-white"
                                    : ""
                            }`}
                        >
                            <LuWarehouse className="text-[18px]" />
                            <h1 className="text-[14px] ">Warehouses</h1>
                        </div>
                    </Link>
                )}
                <Link to={"/admin/products"}>
                    <div
                        onClick={() => setTabValue(4)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            currentPath === "/admin/products"
                                ? "bg-primaryOrange  text-white"
                                : ""
                        }`}
                    >
                        <SlEarphones className="text-[18px]" />
                        <h1 className="text-[14px] ">Products</h1>
                    </div>
                </Link>

                {role === "Warehouse Admin" && (
                    <Link to={"/admin/request"}>
                        <div
                            onClick={() => setTabValue(27)}
                            className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                                currentPath === "/admin/request"
                                    ? "bg-primaryOrange  text-white"
                                    : ""
                            }`}
                        >
                            <FaExchangeAlt className="text-[18px]" />
                            <h1 className="text-[14px] ">Incoming Request</h1>
                        </div>
                    </Link>
                )}

                <Link to={"/admin/orders"}>
                    <div
                        onClick={() => setTabValue(20)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            tabValue === 20 || currentPath === "/admin/order"
                                ? "bg-primaryOrange  text-white"
                                : ""
                        }`}
                    >
                        <MdOutlineLibraryBooks className="text-[18px]" />
                        <h1 className="text-[14px] ">Orders List</h1>
                    </div>
                </Link>
                <Link to={"/admin/approval"}>
                    <div
                        onClick={() => setTabValue(10)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            tabValue === 10 || currentPath === "/admin/approval"
                                ? "bg-primaryOrange  text-white"
                                : ""
                        }`}
                    >
                        <MdOutlineLibraryBooks className="text-[18px]" />
                        <h1 className="text-[14px] ">Orders Approval</h1>
                    </div>
                </Link>
                <Link to={"/admin/delivery"}>
                    <div
                        onClick={() => setTabValue(50)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            tabValue === 50 || currentPath === "/admin/delivery"
                                ? "bg-primaryOrange  text-white"
                                : ""
                        }`}
                    >
                        <MdOutlineLibraryBooks className="text-[18px]" />
                        <h1 className="text-[14px] ">Deliver Order</h1>
                    </div>
                </Link>
                {/* <Link to={"/admin/report"}></Link> */}
                {role === "Owner" && (
                    <Link to={"/admin/category"}>
                        <div
                            onClick={() => setTabValue(5)}
                            className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                                currentPath === "/admin/category"
                                    ? "bg-primaryOrange  text-white"
                                    : ""
                            }`}
                        >
                            <SlEarphones className="text-[18px]" />
                            <h1 className="text-[14px] ">Category</h1>
                        </div>
                    </Link>
                )}
                <Link to={"/admin/report"}>
                    <div
                        onClick={() => setTabValue(6)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            tabValue === 6 ? "bg-primaryOrange  text-white" : ""
                        }`}
                    >
                        <TbReport className="text-[18px]" />
                        <h1 className="text-[14px] ">Report</h1>
                    </div>
                </Link>
                <Link to={"/admin/stock"}>
                    <div
                        onClick={() => setTabValue(7)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            tabValue === 7 ? "bg-primaryOrange  text-white" : ""
                        }`}
                    >
                        <TbReport className="text-[18px]" />
                        <h1 className="text-[14px] ">Manage Stock</h1>
                    </div>
                </Link>
                {role === "Owner" && (
                <Link to={"/admin/history"}>
                    <div
                        onClick={() => setTabValue(8)}
                        className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                            tabValue === 8 ? "bg-primaryOrange  text-white" : ""
                        }`}
                    >
                        <TbHistory className="text-[18px]" />
                        <h1 className="text-[14px] ">History</h1>
                    </div>
                </Link>
                )}
                <div
                    onClick={() => setTabValue(9)}
                    className={`flex items-center px-[26px] gap-3 h-[40px] text-[#5F6C72] cursor-pointer ${
                        tabValue === 9 ? "bg-primaryOrange  text-white" : ""
                    }`}
                >
                    <GoSignOut className="text-[18px]" />
                    <button
                        className="text-[14px]"
                        onClick={logoutButtonHandler}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default SidebarAdmin;
