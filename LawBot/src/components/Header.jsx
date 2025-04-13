import React from "react";
import logo from "../assets/로고.png";
import { Button } from "./Button";
import { Nav } from "./Nav";
import { Link } from "react-router-dom";
export const Header = () => {
    return (
        <div className="p-10 flex-1">
            <div className="w-full h-auto flex flex- justify-between">
                <div class="flex felx-row">
                    <img src={logo} className="w-16 sm:w-16 md:w-18 lg:w-20 h-auto" />
                    <div className="flex-col text-[#653F21] font-bold text-xl sm:text-2xl md:text-3xl ml-3 mt-3 font-['KanitBold']">
                        <p>노동</p>
                        <p>LawBot</p>
                    </div>
                </div>
                <Nav />
                <Link to={"/login"}>
                    <Button text="login" text-xs sm:text-sm md:text-base lg:text-lg p-2 sm:p-3 />
                </Link>
            </div>
        </div>
    );
};
