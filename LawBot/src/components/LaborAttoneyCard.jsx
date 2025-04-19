import React from "react";
import { useNavigate } from "react-router-dom";
import { LABOR_ATTORNEY_CHAT } from "../constants/path";

export const LaborAttoneyCard = ({ id, name, introduce, profile, idx }) => {
    const navigate = useNavigate();

    const goChat = () => {
        navigate(`/${LABOR_ATTORNEY_CHAT}/${id}`);
    };

    return (
        <div
            className={`card card-side bg-base-100 shadow-sm ${
                idx == 0 && "md:col-start-1 md:col-end-3"
            }
                ${idx == 9 && "md:col-start-2 md:col-end-4"}
            }`}
        >
            <figure className="shrink-0">
                <img
                    src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
                    alt="Movie"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{name}</h2>
                <p className="line-clamp-7">{introduce}</p>
                <div className="card-actions justify-end">
                    <button className="btn btn-primary" onClick={goChat}>
                        채팅하기
                    </button>
                </div>
            </div>
        </div>
    );
};
