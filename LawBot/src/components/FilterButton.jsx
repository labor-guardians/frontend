export const FilterButton = ({
  label,
  value,
  icon: Icon,
  checked,
  onClick,
}) => {
  return (
    <div
      className="flex flex-col items-center grow-0 shrink-0 hover:cursor-pointer transition-all active:scale-[97%] transform"
      onClick={() => onClick(value)}
    >
      <div
        className={`p-3 sm:p-5 rounded-full w-fit ${checked ? 'bg-[#886b46]' : 'bg-[#f1eada]'}`}
      >
        <Icon
          className="text-base sm:text-[36px]"
          color={checked ? '#FEF9EB' : '#beac93'}
        />
      </div>
      <p className="text-xs sm:text-base">{label}</p>
    </div>
  );
};
