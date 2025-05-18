export const SelectBox = ({ value, onChange, options, className }) => (
  <select value={value} onChange={onChange} className={className}>
    {options.map((opt) => (
      <option key={opt} value={opt}>
        {opt}
      </option>
    ))}
  </select>
);
