import React from "react";

export const InputText = ({ label, placeholder, isValidation = true, validationText }) => {
    return (
        <label className="floating-label ">
            <span>{label}</span>
            <input type="text" placeholder={placeholder} className="input input-md" />
            {isValidation || (
                <p className="text-red-500 px-2 py-1 w-auto text-sm">{validationText}</p>
            )}
        </label>
    );
};
