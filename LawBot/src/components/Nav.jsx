import React from "react";
import { Link } from "react-router-dom";

export const Nav = () => {
    return (
        <ul className="menu menu-vertical sm:menu-horizontal bg-base-200 rounded-box flex items-center gap-2.5">
            <li className="relative">
                <Link to="/chatbot" className="px-6">
                    챗봇
                </Link>
            </li>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <li>
                <Link to="/labor-attorney-list" className="px-6">
                    노무사
                </Link>
            </li>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <li>
                <Link to="/labor-attorney-chat-history" className="px-6">
                    채팅기록
                </Link>
            </li>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <li>
                <Link to="/mypage" className="px-6">
                    마이페이지
                </Link>
            </li>
        </ul>
    );
};
