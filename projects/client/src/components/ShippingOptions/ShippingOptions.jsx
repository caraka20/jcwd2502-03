import React, { useState } from "react";

const ShippingOptions = ({
  shippingOptions,
  setShippingPrice,
  shippingPrice,
  nearestWarehouse,
  setShippingType,
}) => {
  const [selectedShipping, setSelectedShipping] = useState();

  const handleShippingOptionClick = (item) => {
    setSelectedShipping(item.service);
    setShippingPrice(item.cost[0].value);
    setShippingType(item.description);
  };

  return (
    <>
      {shippingOptions &&
        shippingOptions.map((value, index) => {
          return (
            <div key={index}>
              <div className="mb-[24px]  ">
                <h1 className="text-[24px] font-semibold  ">
                  Shipping Options
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <h1>Courier type :</h1>
                <h1 className="text-[18px]">{value.code.toUpperCase()}</h1>
              </div>
              <div className="flex justify-between items-center mb-[24px]">
                <h1>Nearest Warehouse :</h1>
                <h1 className="text-[18px]">
                  {nearestWarehouse.name.toUpperCase()}
                </h1>
              </div>
              <div className="wrap-grid ">
                <div className="shipping  grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {value.costs.map((item, index) => {
                    return (
                      <div
                        onClick={() => handleShippingOptionClick(item)}
                        key={index}
                        className={`w-[300px] ${
                          !shippingPrice ? " text-neutral " : ""
                        } ${
                          selectedShipping === item?.service  && shippingPrice
                            ? "border-primaryOrange text-primaryOrange"
                            : ""
                        } cursor-pointer  hover:border-primaryOrange   flex flex-col items-center justify-center   h-[150px] border-2 rounded-xl shadow-md`}
                      >
                        <h1 className="text-center text-[18px] font-medium mb-[4px]">
                          {item?.service}
                        </h1>
                        <h1 className="text-center text-[14px]">
                          {item?.description}
                        </h1>
                        <h1 className="text-center text-[12px]">
                          {`Estimated order arrival ${item?.cost[0]?.etd
                            .split("HARI")
                            .join("")} days `}
                        </h1>
                        <h1 className={`text-green-400  `}>
                          {`${Number(item.cost[0].value).toLocaleString(
                            "id-ID",
                            {
                              style: "currency",
                              currency: "IDR",
                            }
                          )}`}
                        </h1>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default ShippingOptions;
