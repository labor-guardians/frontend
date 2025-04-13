import React from "react";

export const Button = ({ text, size, onClick, type = "button" }) => {
    return (
        <button
            type={type}
            className={`btn ${size} text-white bg-[#653F21] hover:bg-[#593315]`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};
