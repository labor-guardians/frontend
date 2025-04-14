import React from "react";
import logo from "../assets/로고.png";
import { Button } from "./Button";
import { Nav } from "./Nav";
import { Link, useNavigate } from "react-router-dom";
export const Header = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="navbar bg-base-100 ">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {" "}
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />{" "}
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu dropdown-content rounded-box z-1 mt-3 shadow bg-base-200 "
                    >
                        <li>
                            <Link to="/chatbot">챗봇</Link>
                            <ul className="menu bg-base-200 rounded-box w-56">
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
                            <Link to="/labor-attorney-list">노무사</Link>
                        </li>
                        <li>
                            <Link to="/labor-attorney-chat-history">채팅기록</Link>
                        </li>
                        <li>
                            <Link to="/mypage">마이페이지</Link>
                        </li>
                    </ul>
                </div>

                <Link className="flex flex-row">
                    <img src={logo} className="w-14 md:w-18 h-fit  ml-1" />
                    <div className="flex flex-col justify-center text-[#653F21] font-bold text-xl md:text-2xl ml-3 font-['KanitBold']">
                        <p>노동</p>
                        <p>LawBot</p>
                    </div>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <Nav />
            </div>
            <div className="navbar-end">
                <Button
                    text="login"
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    p-2
                    sm:p-3
                    onClick={goToLogin}
                />
            </div>
        </div>
    );
};
