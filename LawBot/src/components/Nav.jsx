import { Link } from 'react-router-dom';
import {
  CHAT_BOT,
  LABOR_ATTORNEY_CHAT_HISTORY,
  LABOR_ATTORNEY_LIST,
  MYPAGE,
} from '../constants/path';

export const Nav = () => {
  return (
    <ul className="menu menu-vertical sm:menu-horizontal rounded-box flex items-center gap-2.5 bg-[#e7dfcc]">
      <li className="relative">
        <Link
          to={CHAT_BOT}
          className="px-6 text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"

          // onMouseDown={(e) => e.currentTarget.classList.add('bg-amber-50')}
        >
          챗봇
        </Link>
      </li>
      <div className="h-2.5 w-[1px] bg-[#c9c0ad]"></div>
      <li>
        <Link
          to={LABOR_ATTORNEY_LIST}
          className="px-6 text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
        >
          노무사
        </Link>
      </li>
      <div className="h-2.5 w-[1px] bg-[#c9c0ad]"></div>
      <li>
        <Link
          to={LABOR_ATTORNEY_CHAT_HISTORY}
          className="px-6 text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
        >
          상담기록
        </Link>
      </li>
      <div className="h-2.5 w-[1px] bg-[#c9c0ad]"></div>
      <li>
        <Link
          to={MYPAGE}
          className="px-6 text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
        >
          마이페이지
        </Link>
      </li>
    </ul>
  );
};
