import React from "react";

const OptionProduct = (props) => {
    const { product } = props;
    // "Payment Pending",
    // "Waiting for Payment Approval",
    // "Order Process",
    // "Package Sent",
    // "Package Arrived",
    // "Order Completed",
    // "Order Canceled"



    return (
        <>
            <select
                id="status"
                className="border-[#E4E7E9] w-[200px] text-gray-500 rounded-[4px] h-[40px] text-[14px] cursor-pointer"
                onChange={props.onChange}
            >
                <option selected value="">
                    {props.valueName || "Select Product"}
                </option>
                {product && product.map((value, index) => {

                    return (
                        <option key={index} value={value.id}>
                            {value.product_name}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export default OptionProduct;
