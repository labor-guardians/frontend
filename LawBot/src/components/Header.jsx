import { useEffect, useState } from 'react';
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
export const Header = () => {
  const navigate = useNavigate();
  const [id, setId] = useState(null);

  useEffect(() => {
    const localStorgaeId = localStorage.getItem('id');
    setId(localStorgaeId);
  }, []);

  const goToLogin = () => {
    navigate(LOGIN);
  };

  const logout = () => {
    localStorage.clear();
    window.location.replace('/');
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
            className="menu dropdown-content rounded-box z-1 mt-3 shadow  bg-white "
          >
            <li>
              <Link to={CHAT_BOT}>챗봇</Link>
              <ul className="menu rounded-box w-56  bg-white">
                <li>
                  <a>산재 처리 관련 법률</a>
                </li>
                <li>
                  <a>산재 처리 관련 법률</a>
                </li>
                <li>
                  <a>산재 처리 관련 법률</a>
                </li>
              </ul>
            </li>
            <li>
              <Link to={LABOR_ATTORNEY_LIST}>노무사</Link>
            </li>
            <li>
              <Link to={LABOR_ATTORNEY_CHAT_HISTORY}>상담기록</Link>
            </li>
            <li>
              <Link to={MYPAGE}>마이페이지</Link>
            </li>
          </ul>
        </div>

        <Link className="flex flex-row">
          <img src={logo} className="w-14 md:w-18 h-fit  ml-1" />
          <div className="flex flex-col justify-center text-[#653F21] font-bold text-xl md:text-2xl ml-3 font-['KanitBold']">
            <p className="font-bold">노동</p>
            <p>LawBot</p>
          </div>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <Nav />
      </div>
      <div className="navbar-end">
        {id ? (
          <button
            className="btn btn-outline text-xs sm:text-sm md:text-base lg:text-lg p-2 sm:p-3 border-[#593315] text-[#593315]"
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
            p-2
            sm:p-3
            onClick={goToLogin}
          />
        )}
      </div>
    </div>
  );
};
