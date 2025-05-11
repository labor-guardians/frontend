import logo from '../assets/로고.png';
import { Button } from './Button';
import { Nav } from './Nav';
import { Link, useNavigate } from 'react-router-dom';
import {
  CHAT_BOT,
  LABOR_ATTORNEY_CHAT_HISTORY,
  LABOR_ATTORNEY_LIST,
  LOGIN,
  MYPAGE,
} from '../constants/path';
import { useUser } from '../contexts/UserContext';
export const Header = () => {
  const navigate = useNavigate();

  const { userId, contextLogout } = useUser();

  const goToLogin = () => {
    navigate(LOGIN);
  };

  const logout = () => {
    contextLogout();
    navigate(0);
  };

  return (
    <div className="navbar bg-[#FEF9EB] fixed z-10 h-[88] top-0 left-0 p-10">
      <div className="navbar-start ">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-[999] mt-3 w-52 p-2 dropdown-content shadow "
          >
            <li>
              <Link to={CHAT_BOT} className="whitespace-nowrap">
                챗봇
              </Link>
            </li>
            <li>
              <Link to={LABOR_ATTORNEY_LIST} className="whitespace-nowrap">
                노무사
              </Link>
            </li>
            <li>
              <Link
                to={LABOR_ATTORNEY_CHAT_HISTORY}
                className="whitespace-nowrap"
              >
                상담기록
              </Link>
            </li>
            <li>
              <Link to={MYPAGE} className="whitespace-nowrap">
                마이페이지
              </Link>
            </li>
          </ul>
        </div>

        <Link className="flex flex-row">
          <img src={logo} className="w-14 md:w-18 h-fit " />
          <div className="flex flex-col justify-center text-[#653F21] font-bold text-xl md:text-2xl ml-1 font-['KanitBold'] leading-7">
            <p className="font-extrabold">노동</p>
            <p>LawBot</p>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <Nav />
      </div>
      <div className="navbar-end">
        {userId ? (
          <button
            className="btn btn-outline text-xs sm:text-sm md:text-base lg:text-lg border-[#593315] text-[#593315] bg-[#FEF9EB] hover:bg-[#F7EED2]"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Button
            text="Login"
            text-xs
            sm:text-sm
            md:text-base
            lg:text-lg
            onClick={goToLogin}
          />
        )}
      </div>
    </div>
  );
};
