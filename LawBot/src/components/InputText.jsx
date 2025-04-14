import React, { forwardRef } from "react";

export const InputText = forwardRef(
  (
    {
      label,
      placeholder,
      isValidation = true,
      validationText,
      value,
      onChange,
      name,
    },
    ref
  ) => {
    return (
      <label className="w-full floating-label">
        <span>{label}</span>
        <input
          type="text"
          placeholder={placeholder}
          className="bg-white text-black border border-gray-300 p-2 rounded-md w-full input input-md"
          value={value}
          onChange={onChange}
          name={name}
          ref={ref}
        />
        {isValidation || (
          <p className="text-red-500 px-2 py-1 w-auto text-sm">
            {validationText}
          </p>
        )}
      </label>
    );
  }
);
