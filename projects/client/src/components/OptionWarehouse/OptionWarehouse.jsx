import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/api";

const OptionWarehouse = (props ) => {
    const {warehouses} = props


  return (
    <>
      <select
        id="Warehouse"
        className="border-[#E4E7E9] w-[200px] text-gray-500 rounded-[4px] h-[40px] text-[14px] cursor-pointer"
        onChange={props.onChange}
      >
        <option selected value="">
          {"Select Warehouse"}
        </option>
        {warehouses &&
          warehouses.map((value, index) => {
            return <option key={index} value={value.id}>{value.name}</option>;
          })}
      </select>
    </>
  );
};

export default OptionWarehouse;
