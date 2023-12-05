import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import axiosInstance from "../../config/api";
import ViewPaymentModal from "../ViewPaymentModal/ViewPaymentModal";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const AdminOrderApproval = ({
  setIsRefreshing,
  isRefreshing,
  refreshOrders,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderApprovalList, setOrderApprovalList] = useState([]);
  const [isViewPayment, setIsViewPayment] = useState("");
  const [order, setOrder] = useState({});
  const [ordersDetails, setOrdersDetails] = useState([]);
  const [transaction_uid, setTransaction_uid] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  const getOrderList = async () => {
    const res = await axiosInstance.post("/order/order-approval");
    setOrderApprovalList(res?.data?.data);
  };

  const getDetailsOrder = async () => {
    try {
      if (transaction_uid) {
        setLoading(true);
        const res = await axiosInstance.post("/order/approval-details", {
          transaction_uid: transaction_uid,
        });

        setOrder(res?.data?.orders);
        setOrdersDetails(res?.data?.ordersDetails);
        setIsModalOpen(true);
      }
    } catch (error) {
      alert(error);
    }finally{
      
    }
  };

  useEffect(() => {
    getDetailsOrder(); // Initial call to populate modal on open
  }, [transaction_uid]); // Trigger when transaction_uid changes

  useEffect(() => {
    if (isRefreshing === true) {
      getOrderList();
      setTransaction_uid("")
    }
  }, [isRefreshing]);

  useEffect(() => {
    getOrderList();
  }, []);



  return (
    <>
      <div className="w-full py-[16px] px-[24px] flex justify-between items-center">
        <h1 className="text-[16px]  font-medium">ORDER APPROVAL</h1>
        <div className="h-[38px] px-[24px] flex  justify-end items-center">
          <button
            onClick={() => {
              setIsViewPayment("");
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
            <th className="w-[20%] text-start pl-[24px]">ORDER ID</th>
            <th className="w-[20%] text-start">STATUS</th>
            <th className="w-[20%] text-start">DATE</th>
            {/* <th className="w-[20%] text-start">SUB TOTAL</th> */}
            <th className="w-[20%]  text-start pr-[24px]">ACTION</th>
          </tr>
        </thead>
      </table>
      <div className="w-full h-[564px] overflow-auto">
        {orderApprovalList.length !== 0 && isRefreshing === false ? (
          <table className="w-full">
            <tbody className=" w-full ">
              {orderApprovalList && orderApprovalList.map((value, index) => {
                return (
                  <tr
                    key={index}
                    value={value.transaction_uid}
                    className="w-full h-[64px]  text-[14px] "
                  >
                    <td className="w-[25%] text-start pl-[24px] text-[#191C1F] ">
                      {value.transaction_uid}
                    </td>
                    <td
                      className={`w-[25%] text-start ${
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
                    <td className="w-[25%] text-start text-[#5F6C72]">
                      {moment(value.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                    </td>
                    {/* <td className="w-[20%] text-start text-[#475156] ">
                      {`${Number(value.total_price).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}`}
                    </td> */}
                    <td className="w-[25%]   h-full ">
                      {value.status !== "Payment Pending" ? (
                        <div className="flex justify-center px-[10px]">
                          <button
                            onClick={() => {
                              setTransaction_uid(value?.transaction_uid);
                            }}
                            className="flex w-full  rounded-xl justify-center gap-2 items-center cursor-pointer  bg-[#2DA5F3] text-white "
                          >
                            View Payment Proof{" "}
                            {/* <HiArrowRight className="text-[14px] text-white" /> */}
                          </button>
                          <ViewPaymentModal
                            isOpen={isModalOpen}
                            setIsModalOpen={setIsModalOpen}
                            order={order}
                            ordersDetails={ordersDetails}
                            getOrderList={getOrderList}
                            setIsRefreshing={setIsRefreshing}
                            setIsViewPayment={setIsViewPayment}
                            setTransaction_uid={setTransaction_uid}
                          />
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
    </>
  );
};

export default AdminOrderApproval;
