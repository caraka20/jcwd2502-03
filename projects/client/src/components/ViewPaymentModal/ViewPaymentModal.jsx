import React, { useEffect } from "react";
import Modal from "react-modal";
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import axiosInstance from "../../config/api";
import CardOrderDetail from "../CardOrderDetail/CardOrderDetail";
import toast, { Toaster } from "react-hot-toast";

const ViewPaymentModal = ({
  setIsViewPayment,
  isOpen,
  setIsModalOpen,
  transaction_uid,
  order,
  ordersDetails,
  getOrderList,
  setIsRefreshing,
  setTransaction_uid,
}) => {
  const handleConfirm = async () => {
    try {
      const res = await axiosInstance.put("/order/confirm", {
        products: ordersDetails, users_id: order.users_id
      });

      toast.success(res.data.message);
      setIsModalOpen(false);
      getOrderList();
      setIsRefreshing(true);
    } catch (error) {
      console.log(error);
    }finally{
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  const customStyle = {
    content: {
      width: "700px",
      height: "800px",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "8px",
      z: "50",
      paddingRight: "24px",
    },
  };

  console.log(order);

  const handleReject = async () => {
    try {
      const res = await axiosInstance.put("/order/reject", {
        transaction_uid: order?.transaction_uid,
        users_id: order?.users_id,
      });

      console.log(res);
      toast.success(res.data.message);
      setIsModalOpen(false);
      getOrderList();
      setIsRefreshing(true);
    } catch (error) {
      alert(error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };
 
  return (
    <Modal
      style={customStyle}
      overlayClassName={
        "fixed w-full h-screen top-0 left-0 z-[1000] backdrop-blur-sm flex justify-center items-center"
      }
      isOpen={isOpen}
    >
      <div>
        <div
          onClick={() => {
            setIsModalOpen(false);
            setTransaction_uid("");
          }}
          className="cursor-pointer px-[24px] py-[16px] flex mb-[24px]  items-center gap-3 border-b-2"
        >
          <HiOutlineArrowSmLeft className="text-[24px]" />
          <h1>Back</h1>
        </div>
        <div
          className=""
          style={{
            height: "auto",
            margin: "0 auto",
            width: "100%",
          }}
        >
          {/* <img className="w-full h-[100px]" src={order?.payment_proof?.substring(6)} alt="" /> */}
          <a
            href={`${
              process.env.REACT_APP_IMAGE_SERVER_URL
            }${order?.payment_proof?.substring(6)}`}
            target="_blank"
          >
            <img
              className="w-full h-[300px]"
              src={`${
                process.env.REACT_APP_IMAGE_SERVER_URL
              }${order?.payment_proof?.substring(6)}`}
              alt=""
            />
          </a>
        </div>

        <div className="flex justify-normal gap-5 items-center mt-[24px]">
          <h1>Transaction ID :</h1>
          <h1>{order?.transaction_uid}</h1>
        </div>

        <div className="w-full h-[250px] overflow-auto ">
          <CardOrderDetail ordersDetails={ordersDetails} />
        </div>

        <div className="flex justify-between gap-5 items-center">
          <div className=" mt-[24px] w-[50%]  flex justify-center  items-center">
            <button
              onClick={handleReject}
              className="w-full border border-primaryOrange bg-white text-primaryOrange h-[38px] rounded-xl "
            >
              Reject
            </button>
          </div>
          <div className=" mt-[24px]  w-[50%] flex justify-center items-center">
            <button
              onClick={() => handleConfirm()}
              className=" w-full bg-primaryOrange h-[38px] rounded-xl text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewPaymentModal;
