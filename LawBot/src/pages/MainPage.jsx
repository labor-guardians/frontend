import React from "react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { CHAT_BOT } from "../constants/path";

export const MainPage = () => {
  return (
    <>
      <Header />
      <div className={"flex flex-col justify-center items-center mt-[40vh]"}>
        <p
          className={
            "font-FlightSans-Title text-3xl sm:text-5xl lg:text-6xl xl:text-7xl text-center leading-relaxed text-[#653F21]"
          }>
          <span className="animate-fadeIn-0 ">개</span>
          <span className="animate-fadeIn-1">인</span>
          <span className="animate-fadeIn-2">을</span>
          <span className="inline-block animate-fadeIn-3">&nbsp;</span>
          <span className="inline-block animate-fadeIn-4">위</span>
          <span className="inline-block animate-fadeIn-5">한</span>
          <br />
          <span className="inline-block animate-fadeIn-6">노</span>
          <span className="inline-block animate-fadeIn-7">동</span>
          <span className="inline-block animate-fadeIn-8">&nbsp;</span>
          <span className="inline-block animate-fadeIn-9">관</span>
          <span className="inline-block animate-fadeIn-10">련</span>
          <span className="inline-block animate-fadeIn-11">&nbsp;</span>
          <span className="inline-block animate-fadeIn-12">법</span>
          <span className="inline-block animate-fadeIn-13">률</span>
          <span className="inline-block animate-fadeIn-14">&nbsp;</span>
          <span className="inline-block animate-fadeIn-15">자</span>
          <span className="inline-block animate-fadeIn-16">문</span>
          <span className="inline-block animate-fadeIn-17">&nbsp;</span>
          <span className="inline-block animate-fadeIn-18">챗</span>
          <span className="inline-block animate-fadeIn-19">봇</span>
        </p>
        <Link to={CHAT_BOT}>
          <Button
            text="Try LawBot ↗"
            size="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] text-sm sm:text-base md:text-lg mt-5"
          />
        </Link>
      </div>
    </>
  );
};
