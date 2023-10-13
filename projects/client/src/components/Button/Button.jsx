import React from "react";

const Button = (props) => {
  return (
    <>
      <button
        onClick={props.onClick}
        className={`rounded-xl text-white bg-primaryOrange w-full px-[10px] py-[8px] ${props.btnCSS}`}
        disabled={props.disabled}
      >
        {props.btnName}
      </button>
    </>
  );
};

export default Button;
