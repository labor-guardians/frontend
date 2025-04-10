import React from "react";

export const Nav = () => {
    return (
        <div className="w-fit flex justify-center items-center p-2 bg-stone-100 rounded-lg gap-2.5">
            <div className="relative px-7.5 py-2.5 text-sm bg-stone-300 rounded-lg">LawBot챗봇</div>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <div className="relative px-7.5 py-2.5 text-sm">노무사리스트</div>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <div className="relative px-7.5 py-2.5 text-sm">노무사대화기록</div>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <div className="px-7.5 py-2.5 text-sm ">마이페이지</div>
        </div>
    );
};
