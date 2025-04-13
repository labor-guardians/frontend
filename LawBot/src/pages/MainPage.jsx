import React from "react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

export const MainPage = () => {
    return (
        <>
            <div className={"flex flex-col justify-center mt-30 items-center"}>
                <p
                    className={
                        "font-bold text-xl sm:text-2xl md:text-4xl text-center leading-relaxed"
                    }
                >
                    개인을 위한 <br />
                    노동 관련 법률 자문 챗봇
                </p>
                <Button text="Try LawBot ↗" size="w-40 mt-5" />
            </div>
        </>
    );
};
