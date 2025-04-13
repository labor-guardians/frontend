import React from "react";
import logo from "../assets/로고.png";
import { Button } from "./Button";
import { Nav } from "./Nav";
import { useNavigate } from "react-router-dom";
export const Header = () => {
    const navigate = useNavigate();

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="p-10 flex-1">
            <div className="w-full h-auto flex flex- justify-between">
                <div className="flex felx-row">
                    <img src={logo} className="w-16 sm:w-16 md:w-18 lg:w-20 h-auto" />
                    <div className="flex-col text-[#653F21] font-bold text-xl sm:text-2xl md:text-3xl ml-3 mt-3 font-['KanitBold']">
                        <p>노동</p>
                        <p>LawBot</p>
                    </div>
                </div>
                <Nav />
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
