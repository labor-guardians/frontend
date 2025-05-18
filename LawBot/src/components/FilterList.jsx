import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { BULLYING, DISMISSAL, ETC, INJURY, WAGE } from '../constants/category';
import { FaUserSlash } from 'react-icons/fa';
import { FaFaceFrown, FaPersonFallingBurst } from 'react-icons/fa6';
import { IoIosMore } from 'react-icons/io';
import { FilterButton } from './FilterButton';

export const FilterList = ({ checkedFilter, setCheckFilter }) => {
  const filters = [
    { label: '임금/퇴직금', value: WAGE, icon: RiMoneyDollarCircleFill },
    { label: '해고/징계', value: DISMISSAL, icon: FaUserSlash },
    { label: '산업재해', value: INJURY, icon: FaPersonFallingBurst },
    { label: '직장내괴롭힘', value: BULLYING, icon: FaFaceFrown },
    { label: '기타', value: ETC, icon: IoIosMore },
  ];

  return (
    <div className="flex flex-row gap-1.5 sm:gap-12 mb-15">
      {filters.map(({ label, value, icon }) => (
        <FilterButton
          key={value}
          label={label}
          value={value}
          icon={icon}
          checked={checkedFilter === value}
          onClick={setCheckFilter}
        />
      ))}
    </div>
  );
};
