import { Route } from "react-router-dom";
import React from "react";
import Button from "../components/Button/Button";
import Nav from "../components/Navbar/Nav";
import CartPage from "../pages/CartPage/CartPage";
import Homepage from "../pages/Homepage/Homepage";
import CardCategory from "../components/CardCategory/CardCategory";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage";
import CheckoutSuccessPage from "../pages/CheckoutSuccessPage/CheckoutSuccessPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import UserDashboardPage from "../pages/UserDashboardPage/UserDashboardPage";
import LoginRegisterPage from "../pages/LoginRegisterPage/LoginRegisterPage";
import UserVerificationPage from "../pages/UserVerificationPage/UserVerificationPage";
import ShopePage from "../pages/ShopPage/ShopePage";
import DetailProduct from "../pages/DetailProduct/DetailProduct";
import ForgetPasswordPage from "../pages/ForgetPasswordPage/ForgetPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage/ResetPasswordPage";
import OrderHistory from "../components/OrderHistory/OrderHistory";
import Swal from "sweetalert2";
import TabBar from "../components/TabBar/TabBar";
import SideBarDashboard from "../components/SideBarDashboard/SideBarDashboard";
import { useEffect, useState } from "react";
import OrderViewDetails from "../components/OrderViewDetails/OrderViewDetails";
import { useLocation } from "react-router-dom";
import Protected from "./protected";
import AdminOrderApproval from "../components/AdminOrderApproval/AdminOrderApproval";
import { HiChartPie, HiShoppingBag, HiUser } from "react-icons/hi";
import { TbBuildingWarehouse } from "react-icons/tb";
import { Link } from "react-router-dom";
import WarehouseList from "../components/AdminDashboard/WarehouseListAdmin";
import SidebarAdmin from "../components/AdminDashboard/SidebarAdmin";
import DashboardAdmin from "../components/AdminDashboard/DashboardAdmin";
import UsersAdmin from "../components/AdminDashboard/UsersAdmin";
import ProductsAdmin from "../components/AdminDashboard/ProductsAdmin";
import ReportAdmin from "../components/AdminDashboard/ReportAdmin";
import CategoryAdmin from "../components/AdminDashboard/CategoryAdmin";
import Cookies from "js-cookie";
import io from "socket.io-client";
import audioNotif from "./../assets/audionotif.mp3";
import UserBiodata from "../components/UserBiodata/UserBiodata";
import AdminOrderList from "../components/AdminOrderList/AdminOrderList";
import "./sidebaradmin.css";
import MyAddressPage from "../pages/MyAddressPage/MyAddressPage";
import UserListPage from "../pages/UserListPage/UserListPage";
import StockWarehouses from "../components/AdminDashboard/StockWarehouses";
// import ChangePasswordPage from "../pages/ChangePasswordPage"
import HistoryAdmin from "../components/AdminDashboard/ReportAdmin";
import HistoryAdmin2 from "../components/HistoryAdmin/HistoryAdmin2";
import AdminDeliveryOrder from "../components/AdminDeliveryOrder/AdminDeliveryOrder";
import RequestAdmin from "../components/AdminDashboard/RequestAdmin";
const userToken = Cookies.get("user_token");
let socket;
if (userToken) {
  socket = io("http://localhost:8000/", {
    query: { userToken },
  });
}
// import Protected from "./Protected";

const SideBar = ({ children }) => {
  const [tabValue, setTabValue] = useState(1);
  const location = useLocation();
  const currentPath = location.pathname;
  const [isRefreshingOrderHistory, setIsRefreshingOrderHistory] =
    useState(false);

  const refreshOrdersHistory = async () => {
    try {
      setIsRefreshingOrderHistory(true);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshingOrderHistory(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (userToken) {
      socket.on("reject", (message) => {

        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: message.message,
          showConfirmButton: false,
          timer: 1500,
        });
        const audio = new Audio(audioNotif);
        audio.play();
        refreshOrdersHistory();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      socket.on("Package Sent", (message) => {

        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: `Order ${message.transaction_uid} ${message.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
        const audio = new Audio(audioNotif);
        audio.play();
        refreshOrdersHistory();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      socket.on("Package Arrived", (message) => {

        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: message.message,
          showConfirmButton: false,
          timer: 1500,
        });
        const audio = new Audio(audioNotif);
        audio.play();
        refreshOrdersHistory();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      socket.on("accept", (message) => {

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: message.message,
          showConfirmButton: false,
          timer: 1500,
        });
        const audio = new Audio(audioNotif);
        audio.play();
        refreshOrdersHistory();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return (
    <div className={`max-w-[1280px] m-auto `}>
      <TabBar />
      <div className=" wrap-admin flex gap-[72px] h-full mb-[32px] relative">
        <SideBarDashboard
          tabValue={tabValue}
          setTabValue={setTabValue}
          currentPath={currentPath}
        />
        <div
          className={`${
            currentPath === "/dashboard/orders/details" ||
            "/dashboard/orders/details"
              ? "h-auto"
              : "h-[718px]"
          } right w-full  rounded-[4px] border-[1px] shadow-xl `}
        >
          {React.isValidElement(children) &&
            React.cloneElement(children, {
              isRefreshingOrderHistory,
              setIsRefreshingOrderHistory,
              refreshOrdersHistory,
            })}
        </div>
      </div>
    </div>
  );
};

const SideBarAdmin = ({ children }) => {
  const [tabValue, setTabValue] = useState(1);
  const location = useLocation();
  const currentPath = location.pathname;
  console.log(tabValue, "TAB");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshOrders = async () => {
    try {
      setIsRefreshing(true);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (userToken) {
      socket.on("newOrder", (message) => {
        try {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: message.message,
            showConfirmButton: false,
            timer: 1500,
          });
          const audio = new Audio(audioNotif);
          audio.play();
        } catch (error) {
          alert(error);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      socket.on("order complete", (message) => {
        try {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Transaction ID: ${message.transaction_uid} ${message.message}`,
            showConfirmButton: false,
            timer: 1500,
          });
          const audio = new Audio(audioNotif);
          audio.play();
        } catch (error) {
          alert(error);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (userToken) {
      socket.on("upload", (message) => {

        try {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: message.message,
            showConfirmButton: false,
            timer: 1500,
          });
          const audio = new Audio(audioNotif);
          audio.play();
          refreshOrders();
        } catch (error) {
          alert(error);
        }
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);
  return (
    <div className={`max-w-[1280px] m-auto my-[70px]`}>
      {/* <TabBar /> */}
      <div className="flex wrap-admin gap-[72px] h-full mb-[32px] relative">
        <SidebarAdmin
          tabValue={tabValue}
          setTabValue={setTabValue}
          currentPath={currentPath}
        />
        <div
          className={`${
            currentPath === "/admin/orders/details" ||
            currentPath === "/admin/orders/details" ||
            currentPath === "/admin/history" ||
            currentPath === "/admin/report"
              ? "h-auto"
              : "h-[718px]"
          } right w-full   rounded-[4px] border-[1px] shadow-xl `}
        >
          {/* {children} */}
          {React.cloneElement(children, {
            refreshOrders,
            setIsRefreshing,
            isRefreshing,
          })}
        </div>
      </div>
    </div>
  );
};

// ownerPage, adminPage, customerPage

const routes = [
  <Route
    path="/cart"
    element={
      <Protected customerPage={true}>
        <CartPage />
      </Protected>
    }
  />,
  <Route
    path="/"
    element={
      <Protected customerPage={true}>
        <Homepage />
      </Protected>
    }
  />,
  <Route
    path="/success"
    element={
      <Protected customerPage={true}>
        <CheckoutSuccessPage />
      </Protected>
    }
  />,
  <Route path="*" element={<NotFoundPage />} />,
  <Route
    path="/dashboard"
    element={
      <Protected customerPage={true}>
        <UserDashboardPage />
      </Protected>
    }
  />,
  <Route path="/login" element={<LoginRegisterPage />} />,
  <Route
    path="/verification"
    element={
      <Protected customerPage={true}>
        <UserVerificationPage />
      </Protected>
    }
  />,
  <Route
    path="/product"
    element={
      <Protected customerPage={true}>
        <ShopePage />
      </Protected>
    }
  />,
  <Route
    path="/product/:idProduct"
    element={
      <Protected customerPage={true}>
        <DetailProduct />
      </Protected>
    }
  />,
  <Route
    path="/"
    element={
      <Protected customerPage={true}>
        <Homepage />
      </Protected>
    }
  />,
  <Route
    path="/checkout"
    element={
      <Protected customerPage={true}>
        <CheckoutPage />
      </Protected>
    }
  />,
  <Route
    path="/test"
    element={
      <Protected customerPage={true}>
        <CheckoutPage />
      </Protected>
    }
  />,
  <Route
    path="/success"
    element={
      <Protected customerPage={true}>
        <CheckoutSuccessPage />
      </Protected>
    }
  />,
  <Route path="*" element={<NotFoundPage />} />,
  // <Route path="/dashboard" element={<UserDashboardPage />} />,
  <Route path="/login" element={<LoginRegisterPage />} />,
  <Route path="/verification" element={<UserVerificationPage />} />,
  <Route path="/product" element={<ShopePage />} />,
  <Route path="/product/:idProduct" element={<DetailProduct />} />,
  // <Route path="/change-password" element={<ChangePasswordPage />} />,
  <Route
    path="/product"
    element={
      <Protected customerPage={true}>
        <ShopePage />
      </Protected>
    }
  />,
  <Route
    path="/product/:idProduct"
    element={
      <Protected customerPage={true}>
        <DetailProduct />
      </Protected>
    }
  />,
  // <Route path="/change-password" element={<ChangePasswordPage />} />,
  <Route path="/forget-password" element={<ForgetPasswordPage />} />,
  <Route path="/reset-password" element={<ResetPasswordPage />} />,
  // <Route path="/admin/warehouses" element={<WarehouseList />} />,

  // USER DASHBOARD

  <Route
    path="/dashboard/orders"
    element={
      <Protected customerPage={true}>
        <SideBar>
          <OrderHistory />
        </SideBar>
      </Protected>
    }
  />,
  <Route
    path="/dashboard/orders/details"
    element={
      <Protected customerPage={true}>
        <SideBar>
          <OrderViewDetails />
        </SideBar>
      </Protected>
    }
  />,

  <Route
    path="/dashboard/profile"
    element={
      <Protected customerPage={true}>
        <SideBar>
          <UserBiodata />
        </SideBar>
      </Protected>
    }
  />,
  <Route
    path="/dashboard/wishlist"
    element={
      <Protected customerPage={true}>
        <SideBar>Wishlist</SideBar>
      </Protected>
    }
  />,
  <Route
    path="/dashboard/addresses"
    element={
      <Protected customerPage={true}>
        <SideBar>
          <MyAddressPage />
        </SideBar>
      </Protected>
    }
  />,
  <Route
    path="/dashboard/settings"
    element={
      <Protected customerPage={true}>
        <SideBar>settings</SideBar>
      </Protected>
    }
  />,

  // Admin Dashboard
  <Route
    path="/admin/warehouses"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <WarehouseList />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/dashboard"
    element={
      <Protected ownerPage={true}>
        {" "}
        <SideBarAdmin>
          <DashboardAdmin />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/users"
    element={
      <Protected ownerPage={true}>
        {" "}
        <SideBarAdmin>
          <UserListPage />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/products"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <ProductsAdmin />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/category"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <CategoryAdmin />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
  path="/admin/request"
  element={
    <Protected ownerPage={true}>
      <SideBarAdmin>
        <RequestAdmin />
      </SideBarAdmin>
    </Protected>
  }
/>,
  <Route
    path="/admin/orders"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <AdminOrderList />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/orders/details"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <OrderViewDetails />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/approval"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <AdminOrderApproval />
        </SideBarAdmin>
      </Protected>
    }
  />,

  <Route
    path="/admin/delivery"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <AdminDeliveryOrder />
        </SideBarAdmin>
      </Protected>
    }
  />,

  <Route
    path="/admin/report"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <ReportAdmin />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/stock"
    element={
      <Protected ownerPage={true}>
        <SideBarAdmin>
          <StockWarehouses />
        </SideBarAdmin>
      </Protected>
    }
  />,
  <Route
    path="/admin/history"
    element={
      <SideBarAdmin>
        <HistoryAdmin2 />
      </SideBarAdmin>
    }
  />,
];

export default routes;
