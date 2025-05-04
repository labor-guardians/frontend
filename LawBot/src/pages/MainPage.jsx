import React from "react";
import { Header } from "../components/Header";
import { Button } from "../components/Button";

export const MainPage = () => {
  return (
    <>
      <Header />
      <div className={"flex flex-col justify-center items-center mt-[25vh]"}>
        <p className={"font-bold text-[3vw] text-center leading-relaxed"}>
          개인을 위한 <br />
          노동 관련 법률 자문 챗봇
        </p>
        <Button
          text="Try LawBot ↗"
          size="sm:w-[20vw] md:w-[15vw] lg:w-[10vw] mt-5"
        />
      </div>
    </>
  );
};
