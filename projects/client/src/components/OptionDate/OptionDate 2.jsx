import React from "react";

const OptionDate = (props) => {
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
                    {props.valueName || "Select Month"}
                </option>
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
            </select>
        </>
    );
};

export default OptionDate;
