import React, { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import moment from "moment";
import OptionStatus from "../OptionStatus/OptionStatus";
import axiosInstance from "../../config/api";
import Button from "../Button/Button";
import OptionWarehouse from "../OptionWarehouse/OptionWarehouse";
import "../AdminOrderList/adminorderlist.css";
import OptionCategory from "../OptionCategory/OptionCategory";
import OptionDate from "../OptionDate/OptionDate";
import OptionProduct from "../OptionProducts/OptionProducts";

const ReportAdmin = ({ setIsRefreshing, isRefreshing, refreshOrders }) => {
    const user = "Warehouse Admin";
    const [role, setRole] = useState("");
    const [adminOrderList, setAdminOrderList] = useState([]);

    const [optionStatus, setOptionStatus] = useState("");
    const [product, setProduct] = useState([]);
    const [valueProduct, setValueProduct] = useState("");
    const [category, setCategory] = useState([]);
    const [valueCategory, setValueCategory] = useState("");
    const [date, setDate] = useState("");
    const [warehouse2, setWarehouse2] = useState("");
    const [warehouses, setWarehouses] = useState([]);

    const cardsPerPage = 8; // Number of cards to display per page
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate the index range for the current page
    const indexOfLastCard = currentPage * cardsPerPage;
    const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    const currentCards = adminOrderList?.slice(
        indexOfFirstCard,
        indexOfLastCard
    );

    const formatRupiah = (value) => {
        const formattedValue = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

        return formattedValue;
    };

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

            setWarehouses(res.data.data);
        } catch (error) {
            alert(error);
        }
    };

    const orderList = async () => {
        try {
            const res = await axiosInstance.post(
                `/report/transaction?warehouses_id2=${warehouse2}&productId=${valueProduct}&status=${optionStatus}&products_categories_id=${valueCategory}&stateOfDate=${date}`
            );

            const dataAsArray = Array.isArray(res.data.result.countNewOrder)
                ? res.data.result.countNewOrder
                : [res.data.result.countNewOrder];


            setAdminOrderList(dataAsArray);
        } catch (error) {
            console.log(error);
        }
    };

    const clearFilters = () => {
      setOptionStatus("");
      setProduct([]);  // Reset to default value
      setCategory([]);  // Reset to default value
      setDate("");
      setWarehouse2("");
  };



    const userRole = async () => {
        try {
            const response = await axiosInstance.get("/order/role");

            setRole(response.data.data);
        } catch (error) {
            alert(error);
        }
    };

    const productCategory = async () => {
        try {
            const res = await axiosInstance.get(`/category/`);

            setCategory(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const productData = async () => {
        try {
            const res = await axiosInstance.get(`/product/`);

            setProduct(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        orderList();
    }, []);

    useEffect(() => {
        productCategory();
        productData();
        getWarehouseData();
        userRole();
    }, []);

    useEffect(() => {
        orderList();
    }, [optionStatus, warehouse2, valueProduct, valueCategory, date]);

    return (
        <>
            {user === "Warehouse Admin" ? (
                <>
                    <div className="w-full overflow-auto py-[16px] px-[24px] flex justify-between items-center">
                        {/* <h1 className="text-[16px]  col-date  font-medium">ORDER LIST</h1> */}
                        <div className="flex flex-col gap-3">
                            {role === "Owner" ? (
                                <OptionWarehouse
                                    onChange={(e) =>
                                        setWarehouse2(e.target.value)
                                    }
                                    warehouses={warehouses}
                                />
                            ) : (
                                ""
                            )}

                            <OptionStatus
                                onChange={(e) =>
                                    setOptionStatus(e.target.value)
                                }
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <OptionCategory
                                category={category}
                                onChange={(e) =>
                                    setValueCategory(e.target.value)
                                }
                            />
                            <OptionDate
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <OptionProduct
                                product={product}
                                onChange={(e) =>
                                    setValueProduct(e.target.value)
                                }
                            />
                            <div className="pt-3">
                                <div className="w-full text-[12px] text-[#475156] pb-1">
                                    Total Revenue:{" "}
                                    <span style={{ color: '#008000' }}>
                                    {formatRupiah(
                                        adminOrderList.reduce(
                                            (sum, item) =>
                                                sum +
                                                parseFloat(item.product_price),
                                            0
                                        )
                                    )}
                                    </span>
                                </div>

                                <div className="w-full text-[12px] text-[#475156] pb-1">
                                    Total Items Sold:{" "}
                                    <span style={{ color: '#008000' }}>
                                    {adminOrderList.reduce(
                                        (sum, item) =>
                                            sum + parseFloat(item.quantity),
                                        0
                                    )}{" "}
                                    Item(s)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[38px] px-[24px] flex  justify-end items-center">
                            <button
                                onClick={() => {
                                    orderList();
                                    refreshOrders();
                                    clearFilters()
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
                    <table className="w-full">
                        <thead className="h-[38px] w-full  bg-[#F2F4F5]">
                            <tr className="w-full text-[12px] text-[#475156]">
                                <th className="w-[25%]  text-start pl-6">
                                    PRODUCT
                                </th>
                                <th className="w-[13%]  text-start pl-3">
                                    PRICE
                                </th>
                                <th className="w-[10%] text-start">
                                    QUANTITY
                                </th>
                                <th className="w-[13%] text-start">STATUS</th>
                                <th className="w-[13%] text-start">
                                    WAREHOUSE
                                </th>
                                <th className="w-[13%] col-order text-start">
                                    ORDER ID
                                </th>
                                <th className="w-[13%] col-date text-start">
                                    DATE
                                </th>
                            </tr>
                        </thead>
                    </table>
                    <div className="w-full h-[520px] overflow-auto ">
                        {currentCards.length !== 0 && isRefreshing === false ? (
                            <table className="w-full    ">
                                <tbody className=" w-full  ">
                                    {currentCards &&
                                        currentCards.map((value, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    value={
                                                        value.transaction_uid
                                                    }
                                                    className="w-full h-[64px]  text-[14px] "
                                                >
                                                    <td className="w-[25%] col-order text-start text-[#191C1F] pl-6">
                                                        {
                                                            value.product
                                                                .product_name
                                                        }
                                                    </td>
                                                    <td className="w-[13%] col-order text-start text-[#191C1F] ">
                                                        {formatRupiah(
                                                            value.product_price
                                                        )}
                                                    </td>
                                                    <td className="w-[10%] col-order text-start text-[#191C1F] pl-4">
                                                        {value.quantity}
                                                    </td>
                                                    <td
                                                        className={`w-[13%] text-start ${
                                                            value.status ===
                                                            "Payment Pending"
                                                                ? " text-[#FFD700]"
                                                                : value.status ===
                                                                  "Waiting for Payment Approval"
                                                                ? "text-[#FFA500]"
                                                                : value.status ===
                                                                  "Order Process"
                                                                ? "text-[#00BFFF]"
                                                                : value.status ===
                                                                  "Package Sent"
                                                                ? "text-[#008000]"
                                                                : value.status ===
                                                                  "Package Arrived"
                                                                ? "text-[#008000]"
                                                                : value.status ===
                                                                  "Order Completed"
                                                                ? "text-[#008000]"
                                                                : value.status ===
                                                                  "Order Canceled"
                                                                ? "text-[#FF0000]"
                                                                : ""
                                                        }`}
                                                    >
                                                        {value.status}
                                                    </td>
                                                    <td className="w-[13%] col-order text-start text-[#191C1F] ">
                                                        {value.warehouse.name}
                                                    </td>
                                                    <td className="w-[13%] col-order text-start text-[#191C1F] ">
                                                        {value.transaction_uid}
                                                    </td>
                                                    <td className="w-[13%] col-date text-start text-[#5F6C72]">
                                                        {moment(
                                                            value.createdAt
                                                        ).format(
                                                            "YYYY-MM-DD HH:mm:ss"
                                                        )}
                                                    </td>

                                                    <td className="w-[13%] h-full ">
                                                        {value.status !==
                                                        "Payment " ? (
                                                            <div className="flex justify-center px-[10px]">
                                                                {/* <button
                                                                    onClick={() => {
                                                                        navigate(
                                                                            `/admin/orders/details?transaction_uid=${value.transaction_uid}&ID=${value.users_id}`
                                                                        );
                                                                    }}
                                                                    className="flex w-full  rounded-xl justify-center gap-2 items-center cursor-pointer  bg-[#2DA5F3] text-white "
                                                                >
                                                                    View Details{" "}
                                                                </button> */}
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
                                <FiRefreshCw
                                    className={`font-bold text-[50px] spin`}
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center items-center h-full">
                                <h1 className="text-[px] text-center">
                                    Oops! It seems there are no orders that
                                    match your search criteria.
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

export default ReportAdmin;
