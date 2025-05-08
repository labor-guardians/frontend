import React, { forwardRef } from 'react';

export const InputText = forwardRef(
  (
    {
      label,
      type = 'text',
      placeholder,
      isValidation = true,
      validationText,
      value,
      onChange,
      onBlur,
      name,
      disabled = false,
      readOnly = false,
    },
    ref,
  ) => {
    return (
      <label className="w-full floating-label">
        <span>{label}</span>
        <input
          type={type}
          placeholder={placeholder}
          className={` text-black border border-gray-300 p-2 rounded-md w-full input input-md ${
            readOnly ? 'bg-gray-100' : 'bg-white'
          }`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
        />
        {isValidation || (
          <p className="text-red-500 px-2 py-1 w-auto text-sm">
            {validationText}
          </p>
        )}
      </label>
    );
  },
);
