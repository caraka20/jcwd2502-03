import React from "react";

const OptionCategory = (props) => {
    const { category } = props;
    // "Payment Pending",
    // "Waiting for Payment Approval",
    // "Order Process",
    // "Package Sent",
    // "Package Arrived",
    // "Order Completed",
    // "Order Canceled"

    // console.log(category);

    return (
        <>
            <select
                id="status"
                className="border-[#E4E7E9] w-[200px] text-gray-500 rounded-[4px] h-[40px] text-[14px] cursor-pointer"
                onChange={props.onChange}
            >
                <option selected value="">
                    {props.valueName || "Select Category"}
                </option>
                {category && category.map((value, index) => {
                    // console.log(value)
                    return (
                        <option key={index} value={value.id}>
                            {value.category}
                        </option>
                    );
                })}
            </select>
        </>
    );
};

export default OptionCategory;
