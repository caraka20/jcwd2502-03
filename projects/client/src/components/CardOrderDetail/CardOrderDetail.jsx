import React from "react";

const CardOrderDetail = ({ ordersDetails }) => {
  if (ordersDetails.length === 0) {
    return <div>Loading</div>;
  }


  return (
    <>
      {ordersDetails.map((value, index) => {
        return (
          <div
            key={index}
            className="flex gap-2 items-center mb-[16px] w-full "
          >
            <img
              className="w-[30%] h-[84px]  "
              src={`${
                process.env.REACT_APP_IMAGE_SERVER_URL
              }${value?.product?.products_images[0]?.image?.substring(6)}`}
              alt=""
            />
            <div className="w-[70%]">
              <h1 className="text-[14px] ">{value?.product?.product_name}</h1>
              <div className="flex gap-2 justify-between">
                <h1>{`${value?.quantity}x`}</h1>
                <div className="flex gap-3">
                  <h1>Stocks :</h1>
                  <h1>{value?.product?.products_stocks[0]?.stock}</h1>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CardOrderDetail;
