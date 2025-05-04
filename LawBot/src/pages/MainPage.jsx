import React from "react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

export const MainPage = () => {
  return (
    <>
      <Header />
      <div className={"flex flex-col justify-center items-center mt-[40vh]"}>
        <p
          className={
            "font-bold text-[6vw] sm:text-[4vw] md:text-[3vw] text-center leading-relaxed text-[#653F21]"
          }
        >
          개인을 위한 <br />
          노동 관련 법률 자문 챗봇
        </p>
        <Button
          text="Try LawBot ↗"
          size="w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] text-sm sm:text-base md:text-lg mt-5"
        />
      </div>
    </>
  );
};
