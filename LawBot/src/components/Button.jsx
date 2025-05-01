import React from "react";

export const Button = ({
  text,
  size,
  onClick,
  type = "button",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      className={`btn ${size} text-white  ${
        disabled ? "bg-gray-100" : "bg-[#653F21] hover:bg-[#593315]"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
