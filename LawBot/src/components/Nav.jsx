import React from "react";

export const Nav = () => {
    return (
        <div className="w-fit h-fit flex justify-center items-center p-2 bg-stone-100 rounded-lg gap-2.5">
            <div className="relative px-7.5 py-2 text-sm bg-stone-300 rounded-lg">챗봇</div>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <div className="relative px-7.5 py-2 text-sm">노무사</div>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <div className="relative px-7.5 py-2 text-sm">채팅기록</div>
            <div className="h-2.5 w-[1px] bg-stone-300"></div>
            <div className="px-7.5 py-2 text-sm ">My</div>
        </div>
    );
};
