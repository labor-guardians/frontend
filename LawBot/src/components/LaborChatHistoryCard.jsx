import React from "react";
import { useNavigate } from "react-router-dom";
import { LABOR_ATTORNEY_CHAT } from "../constants/path";
import { Button } from "./Button";

export const LaborChatHistoryCard = ({ id, name, lastChat, profile }) => {
    const navigate = useNavigate();

    const goChat = () => {
        navigate(`/${LABOR_ATTORNEY_CHAT}/${id}`);
    };

    return (
        <div className={"card card-side bg-base-100 shadow-sm w-full max-w-3xl h-[120px]"}>
            <figure className="shrink-0">
                <img
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    alt="Movie"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title ">{name}</h2>
                <div className="flex flex-row gap-8">
                    <p className="line-clamp-2">{lastChat}</p>
                    <div className="card-actions w-full justify-end">
                        <Button onClick={goChat} text="이어서 채팅하기" />
                    </div>
                </div>
            </div>
        </div>
    );
};
