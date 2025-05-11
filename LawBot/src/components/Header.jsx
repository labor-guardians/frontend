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
    navigate('/');
  };

  // const refreshToken = Cookies.get('refresh');
  // if (!refreshToken) {
  //   logout();
  // }

  return (
    <div className="navbar bg-[#FEF9EB] fixed z-10 h-[88] top-0 left-0 lg:p-10 py-4 px-2">
      <div className="navbar-start ">
        <div className="dropdown relative">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost p-2 sm:p-4 lg:hidden hover:bg-[#e6dfd1] border-0 text-[#160a02]"
          >
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
            className="relative menu dropdown-content rounded-box z-[10000] mt-3 w-52 p-2 dropdown-content shadow bg-[#e7dfcc]"
          >
            <li>
              <Link
                to={CHAT_BOT}
                className="whitespace-nowrap text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
              >
                챗봇
              </Link>
            </li>
            <li>
              <Link
                to={LABOR_ATTORNEY_LIST}
                className="whitespace-nowrap text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
              >
                노무사
              </Link>
            </li>
            <li>
              <Link
                to={LABOR_ATTORNEY_CHAT_HISTORY}
                className="whitespace-nowrap text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
              >
                상담기록
              </Link>
            </li>
            <li className="z-[999]">
              <Link
                to={MYPAGE}
                className="whitespace-nowrap text-[#140900] hover:bg-[#d8ceb8] active:!bg-[#5e543f] active:!text-[#ececec]"
              >
                마이페이지
              </Link>
            </li>
          </ul>
        </div>

        <Link className="flex flex-row">
          <img src={logo} className="w-14 md:w-18 h-fit " />
          <div className="flex flex-col justify-center text-[#653F21] font-bold text-xl md:text-2xl  ml-1 font-['KanitBold'] leading-7">
            <p className="font-extrabold leading-[1.2rem] md:leading-[1.5rem]">
              노동
            </p>
            <p className="leading-[1.2rem] md:leading-[1.5rem] ">LawBot</p>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <Nav />
      </div>
      <div className="navbar-end">
        {userId ? (
          <button
            className="btn btn-outline me-1 sm:me-3 lg:me-1 border-[#593315] text-[#593315] bg-[#FEF9EB] hover:bg-[#F7EED2]"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <Button
            text="Login"
            size={'me-1 sm:me-3 lg:me-1'}
            onClick={goToLogin}
          />
        )}
      </div>
    </div>
  );
};
