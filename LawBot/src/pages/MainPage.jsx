import React from "react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { ChatBot } from "./ChatBot";
import { CHAT_BOT } from "../constants/path";

export const MainPage = () => {
  return (
    <>
      <div className={"flex flex-col justify-center mt-30 items-center"}>
        <p
          className={
            "font-bold text-xl sm:text-2xl md:text-4xl text-center leading-relaxed text-[#653F21]"
          }
        >
          개인을 위한 <br />
          노동 관련 법률 자문 챗봇
        </p>
        <Link to={CHAT_BOT}>
          <Button text="Try LawBot ↗" size="w-40 mt-5" />
        </Link>
      </div>
    </>
  );
};
