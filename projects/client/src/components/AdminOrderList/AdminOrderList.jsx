import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import moment from "moment";
import OptionStatus from "../OptionStatus/OptionStatus";
import axiosInstance from "../../config/api";
import Button from "../Button/Button";
import toast, { Toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import OptionWarehouse from "../OptionWarehouse/OptionWarehouse";
import "./adminorderlist.css";
const AdminOrderList = ({ setIsRefreshing, isRefreshing, refreshOrders }) => {
  const user = "Warehouse Admin";
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [adminOrderList, setAdminOrderList] = useState([]);

  const [optionStatus, setOptionStatus] = useState("");
  const [warehouse2, setWarehouse2] = useState("");
  const [warehouses, setWarehouses] = useState([]);


  const [maxPages, setMaxPages] = useState(null);

  const cardsPerPage = 8; // Number of cards to display per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the index range for the current page
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = adminOrderList?.slice(indexOfFirstCard, indexOfLastCard);

  const nextPage = () => {
    if (indexOfLastCard < adminOrderList.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getWarehouseData = async () => {
    try {
      const res = await axiosInstance.get("/order/warehouses");
      console.log(res);
      setWarehouses(res.data.data);
    } catch (error) {
      alert(error);
    }
  };

  const orderList = async () => {
    try {
      const res = await axiosInstance.post(
        `/order/admin-orders?status=${optionStatus}&warehouses_id=${warehouse2}`
      );
      setAdminOrderList(res.data.data);
      setMaxPages(res.data.maxPages);
      console.log(res);
    } catch (error) {
      alert(error.data.message);
    }
  };

  const userRole = async () => {
    try {
      const response = await axiosInstance.get("/order/role");

      setRole(response.data.data);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getWarehouseData();
    userRole();
    orderList();
  }, []);

  useEffect(() => {
    orderList();
  }, [optionStatus, setOptionStatus, warehouse2, setWarehouse2]);

  return (
    <>
      {user === "Warehouse Admin" ? (
        <>
          <div className="w-full overflow-auto py-[16px] px-[24px] flex justify-between items-center">
            <h1 className="text-[16px]  col-date  font-medium">ORDER LIST</h1>
            {role === "Owner" ? (
              <OptionWarehouse
                onChange={(e) => setWarehouse2(e.target.value)}
                warehouses={warehouses}
              />
            ) : (
              ""
            )}
            <OptionStatus onChange={(e) => setOptionStatus(e.target.value)} />
            <div className="h-[38px] px-[24px] flex  justify-end items-center">
              <button
                onClick={() => {
                  orderList();
                  refreshOrders();
                }}
                className="cursor-pointer  flex gap-2 justify-center items-center"
              >
                <FiRefreshCw
                  className={`font-bold text-[14px] ${
                    isRefreshing === true ? "spin" : ""
                  }`}
                />
                <h1 className="text-[14px]">Refresh</h1>
              </button>
            </div>
          </div>
          <table className="w-full  ">
            <thead className="h-[38px] w-full  bg-[#F2F4F5]">
              <tr className="w-full  text-[12px] text-[#475156]">
                <th className="w-[20%] col-order text-start pl-[24px]">
                  ORDER ID
                </th>
                <th className="w-[20%] text-start">STATUS</th>
                <th className="w-[20%] col-date text-start">DATE</th>
                <th className="w-[20%] text-start">Warehouse</th>
                <th className="w-[20%]  text-start pr-[24px]">ACTION</th>
              </tr>
            </thead>
          </table>
          <div className="w-full h-[520px] overflow-auto ">
            {currentCards.length !== 0 && isRefreshing === false ? (
              <table className="w-full    ">
                <tbody className=" w-full  ">
                  {currentCards.map((value, index) => {
                    return (
                      <tr
                        key={index}
                        value={value.transaction_uid}
                        className="w-full h-[64px]  text-[14px] "
                      >
                        <td className="w-[20%] col-order text-start pl-[24px] text-[#191C1F] ">
                          {value.transaction_uid}
                        </td>
                        <td
                          className={`w-[20%] text-start ${
                            value.status === "Payment Pending"
                              ? " text-[#FFD700]"
                              : value.status === "Waiting for Payment Approval"
                              ? "text-[#FFA500]"
                              : value.status === "Order Process"
                              ? "text-[#00BFFF]"
                              : value.status === "Package Sent"
                              ? "text-[#008000]"
                              : value.status === "Package Arrived"
                              ? "text-[#008000]"
                              : value.status === "Order Completed"
                              ? "text-[#008000]"
                              : value.status === "Order Canceled"
                              ? "text-[#FF0000]"
                              : ""
                          }`}
                        >
                          {value.status}
                        </td>
                        <td className="w-[20%] col-date text-start text-[#5F6C72]">
                          {moment(value.createdAt).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </td>
                        <td className="w-[20%] text-start text-[#475156] ">
                          {value.warehouse?.name}
                        </td>

                        <td className="w-[20%]   h-full ">
                          {value.status !== "Payment " ? (
                            <div className="flex justify-center px-[10px]">
                              <button
                                onClick={() => {
                                  navigate(
                                    `/admin/orders/details?transaction_uid=${value.transaction_uid}&ID=${value.users_id}`
                                  );
                                }}
                                className="flex w-full  rounded-xl justify-center gap-2 items-center cursor-pointer  bg-[#2DA5F3] text-white "
                              >
                                View Details{" "}
                              </button>
                              {/* <ViewPaymentModal
                                isOpen={isModalOpen}
                                setIsModalOpen={setIsModalOpen}
                                order={order}
                                ordersDetails={ordersDetails}
                                getOrderList={getOrderList}
                                setIsRefreshing={setIsRefreshing}
                                setIsViewPayment={setIsViewPayment}
                                setTransaction_uid={setTransaction_uid}
                              /> */}
                            </div>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : isRefreshing === true ? (
              <div className="flex justify-center items-center h-full">
                <FiRefreshCw className={`font-bold text-[50px] spin`} />
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <h1 className="text-[px] text-center">
                  Oops! It seems there are no orders that match your search
                  criteria.
                </h1>
              </div>
            )}
          </div>
          <div className="Pagination  mt-[25px] mx-[20px] flex  justify-between mb-[20px]">
            <Button
              btnCSS="test1  w-[200px] bg-white text-primaryOrange rounded-xl  border-2 border-orange-500 "
              btnName="Previously"
              onClick={() => previousPage()}
            />
            <Button
              onClick={() => nextPage()}
              btnCSS="test2 w-[200px] text-white rounded-xl"
              btnName="Next"
            />
          </div>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default AdminOrderList;
